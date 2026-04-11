export interface TermGrade {
  numeric?: number;
  letter?: string;
}

export interface Term {
  //unsure if we need both id and title, 
  //but could prevent accidental duplication from the scraper from screwing too much up
  id: string;
  title: string;
  subTermIds?: string[]; //undefined for lowest-level terms like quarters
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

export interface Course {
  id: string; //sourcedId - Skyward, 
  title: string;
  period?: number;
  room?: string;
  teacher?: string;
  officialGrades: Record<string, TermGrade>;
  assignments: Assignment[];
  categoryWeights?: CategoryWeight[]; //if null assume system is unweighted
}

export interface PastCourse {
  id: string;
  title: string;
  credits: number; //use 0.5 as default for semester, 1 as default for year. 
  numeric?: number; //give as equivalent numeric if given gpa for that class instead
  letter?: string; //use N/A for null
  teacher?: string;
  termTitle?: string; //group by term
}

export interface AcademicData {
  currentTerm: string;     // e.g., "Q3"
  terms: Term[]; // e.g., ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"]
  courses: Course[];
  pastCourses?: PastCourse[];
  studentName?: string;
  gpa?: number;
}