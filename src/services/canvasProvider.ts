import { PlatformProvider } from './interfaces';
import { AcademicData, Assignment, Course, CategoryWeight, Term } from '../types';
import * as SecureStore from 'expo-secure-store';

async function fetchCourseDetails(domain: string, token: string, courseId: string, termId: string, isWeighted: boolean): Promise<{ assignments: Assignment[], categoryWeights?: CategoryWeight[] }> {
  try {
    //fetch assignments
    const [submissionsRes, assignmentsRes, groupsRes] = await Promise.all([
      fetch(`https://${domain}/api/v1/courses/${courseId}/students/submissions?student_ids[]=self&per_page=100`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`https://${domain}/api/v1/courses/${courseId}/assignments?per_page=100`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`https://${domain}/api/v1/courses/${courseId}/assignment_groups?per_page=100`, { headers: { Authorization: `Bearer ${token}` } })
    ]);

    if (!submissionsRes.ok) return { assignments : [] };

    const rawSubmissions = await submissionsRes.json();
    const rawAssignments = assignmentsRes.ok ? await assignmentsRes.json() : [];
    const groupMap: Record<string, string> = {};
    const categoryWeights: CategoryWeight[] = [];

    // Map group IDs to string names
    if (groupsRes.ok) {
      const rawGroups = await groupsRes.json();
      rawGroups.forEach((group: any) => {
        groupMap[String(group.id)] = group.name;
        
        if (isWeighted) {
          categoryWeights.push({
            name: group.name,
            weight: (group.group_weight || 0) / 100 //divide by 100 for decimal weights
          });
        }
      });
    }

    const assignmentMap: Record<string, any> = {};
    rawAssignments.forEach((assign: any) => {
      assignmentMap[String(assign.id)] = assign;
    });

    const assignments = rawSubmissions
      .filter((sub: any) => sub.score !== null && sub.score !== undefined)
      .map((sub: any): Assignment => {
        const assignmentInfo = assignmentMap[String(sub.assignment_id)] || {};
        
        return {
          id: String(sub.assignment_id),
          title: assignmentInfo.name || 'Untitled Assignment',
          category: groupMap[String(assignmentInfo.assignment_group_id)] || 'None', //Edge case - Assignment category on site is "None", screws up weights
          termId: assignmentInfo.grading_period_id ? String(assignmentInfo.grading_period_id) : termId,
          score: sub.score, 
          totalPoints: assignmentInfo.points_possible ?? 0,
          weight: assignmentInfo.omit_from_final_grade ? 0 : undefined,
          date: assignmentInfo.due_at ?? undefined,
          isMock: false
        };
      });
    return { 
      assignments, 
      categoryWeights: isWeighted && categoryWeights.length > 0 ? categoryWeights : undefined 
    };
  } catch (error) {
    console.error(`Failed to fetch assignments for course ${courseId}:`, error);
    return { assignments : [] };
  }
}

export const CanvasProvider: PlatformProvider = {
  async login(credentials: any): Promise<boolean> {
    const { domain, token } = credentials;
    const response = await fetch(`https://${domain}/api/v1/users/self/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.ok;
  },

  async fetchData(): Promise<AcademicData> {
    const domain = await SecureStore.getItemAsync('CANVAS_DOMAIN');
    const token = await SecureStore.getItemAsync('CANVAS_TOKEN');

    if (!domain || !token) throw new Error("Missing Canvas credentials.");

    const response = await fetch(`https://${domain}/api/v1/courses?enrollment_state=active&include[]=total_scores&include[]=term`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch Canvas courses.");

    const rawCourses = await response.json();
    const activeCourses = rawCourses.filter((course: any) => !course.access_restricted_by_date);

    const baseTermsMap: Record<string, Term> = {};
    const subTermsMap: Record<string, Term> = {};

    const mappedCourses: Course[] = await Promise.all(activeCourses.map(async (course: any): Promise<Course> => {
      const enrollment = course.enrollments && course.enrollments[0];
      const numericGrade = enrollment?.computed_current_score ?? enrollment?.computed_final_score;
      const letterGrade = enrollment?.computed_current_grade;
      
      const courseId = String(course.id);

      const termId = course.term?.id ? String(course.term.id) : "default-term";
      if (!baseTermsMap[termId] && course.term) {
        baseTermsMap[termId] = { 
          id: termId, 
          title: course.term.name, 
          subTermIds: [] 
        };
      }

      //subterms
      const gpRes = await fetch(`https://${domain}/api/v1/courses/${courseId}/grading_periods`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (gpRes.ok) {
        const gpData = await gpRes.json();
        const periods = gpData.grading_periods || [];
        
        periods.forEach((gp: any) => {
          const gpId = String(gp.id);
          if (!subTermsMap[gpId]) {
            subTermsMap[gpId] = { id: gpId, title: gp.title };
          }
          // Link sub-term to parent base term
          if (baseTermsMap[termId] && !baseTermsMap[termId].subTermIds!.includes(gpId)) {
            baseTermsMap[termId].subTermIds!.push(gpId);
          }
        });
      }

      const isWeighted = course.apply_assignment_group_weights === true;

      //fetch assignments (grade items)
      const { assignments, categoryWeights } = await fetchCourseDetails(domain, token, courseId, termId, isWeighted);

      return {
        id: courseId,
        title: course.name || course.course_code || 'Unknown Course',
        teacher: 'Instructor',
        officialGrades: {
          [termId]: {
            numeric: numericGrade ?? undefined,
            letter: letterGrade || undefined
          }
        },
        assignments: assignments,
        categoryWeights
      };
    }));

    //clean up empty subTermIds arrays and combine all terms
    const compiledBaseTerms = Object.values(baseTermsMap).map(term => {
      if (term.subTermIds && term.subTermIds.length === 0) {
        delete term.subTermIds;
      }
      return term;
    });
    
    const allTerms = [...compiledBaseTerms, ...Object.values(subTermsMap)];
    
    //temporary fallback for currentTerm (we will refine this with date-checking later)
    const currentTerm = allTerms.length > 0 ? allTerms[0].id : "1";

    return {
      courses: mappedCourses,
      terms: allTerms.length > 0 ? allTerms : [{ id: "1", title: "Current Term" }],
      currentTerm: currentTerm
    } as any;
  }
};