export interface TermGrade {
  numeric?: number;
  letter?: string;
}

export interface Term {
  id: string;
  title: string;
  subTermIds?: string[]; //undefined for lowest-level terms like quarters
  absences?: number;
}

export interface Assignment {
  id: string;
  title: string;
  category: string; // "Quiz", "Test", "Homework", etc
  termId: string;
  score?: number; //earned
  totalPoints?: number; //possible
  weight?: number;
  date?: string;
  isMock?: boolean; //what-if or offset assignments
  comment?: string;
}

export interface CategoryWeight {
  name: string;
  weight: number; //decimal, .5 for 50%
}

//scrape newer PAST courses earlier in the output file, as the archive lists courses starting from the top of the input file,
//meaning that those courses are at the top (first seen) when entering the archive screen, so you should be able to scroll to 
//see OLDER courses. if the course is in any of our current terms (if it's during the current "year"?) it will be sorted based on our
//terms array, so [Q1, Q2, etc.] in reverse order. To review,
//Q3 11th grade (Current term)
//Q2
//Q1
//10th grade 2nd sem
//10th grade 1st sem
//9th grade 2nd sem
//...
//should be listed as courses: [{any of Q3, Q2, Q1 anywhere in the array}, {10th grade 2nd sem}, {10th grade 1st sem}, etc.]
export interface Course {
  id: string; //sourcedId - Skyward, 
  title: string;
  period?: number;
  room?: string;
  teacher?: string;
  //this is used as 1.0: full year, .5: half-year for hs. College should just be 1.0 per semester. DO NOT scrape actual credit amounts, if provided a conversion is necessary.
  credits?: number;
  //should be a year like 2025-2026 or a semester/quarter like Fall 2026.
  //this should not be shown to the student, so it's fine to get incorrect years,
  //we just need to group the years correctly.
  termTitle?: string;
  finalGrade?: TermGrade;
  officialGrades: Record<string, TermGrade>;
  assignments: Assignment[];
  absences?: number;
  categoryWeights?: CategoryWeight[]; //if null assume system is unweighted
}

export interface AcademicData {
  currentTerm: string;     // e.g., "Q3"
  terms: Term[]; // e.g., ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"]
  courses: Course[];
  studentName?: string;
  gpa?: number;
}