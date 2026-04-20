import { PlatformProvider } from './interfaces';
import { AcademicData } from '../types';
import * as SecureStore from 'expo-secure-store';

export const CanvasProvider: PlatformProvider = {
  async login(credentials: any): Promise<boolean> {
    const { domain, token } = credentials;
    // Hit a lightweight endpoint to verify the token is valid
    const response = await fetch(`https://${domain}/api/v1/users/self/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.ok;
  },

  async fetchData(): Promise<AcademicData> {
    const domain = await SecureStore.getItemAsync('CANVAS_DOMAIN');
    const token = await SecureStore.getItemAsync('CANVAS_TOKEN');

    if (!domain || !token) throw new Error("Missing Canvas credentials.");

    // Fetch active courses with grading data included
    const response = await fetch(`https://${domain}/api/v1/courses?enrollment_state=active&include[]=total_scores`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error("Failed to fetch Canvas courses.");

    const rawCourses = await response.json();

    const mappedCourses = rawCourses
      .filter((course: any) => !course.access_restricted_by_date)
      .map((course: any) => {
        const enrollment = course.enrollments && course.enrollments[0];
        //current/final/none
        const numericGrade = enrollment?.computed_current_score ?? enrollment?.computed_final_score;
        //letter grade: sometimes provided
        const letterGrade = enrollment?.computed_current_grade;

        return {
          id: String(course.id),
          title: course.name || course.course_code || 'Unknown Course',
          teacher: 'Instructor',//separate api call necessary for teachers
          officialGrades: {
            "1": {
              numeric: numericGrade ?? undefined,
              letter: letterGrade || undefined
            }
          },
          assignments: []
        };
      });

    console.log("Successfully mapped courses:", mappedCourses);

    //parsed data
    return {
      courses: mappedCourses,
      terms: [{ id: "1", name: "Current Term" }], //TODO
      currentTerm: "1"
    } as any;
  }
};