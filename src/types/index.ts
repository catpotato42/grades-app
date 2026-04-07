export interface TermGrade {
  numeric?: number;
  letter?: string;
}

export interface Assignment {
  id: string;
  title: string;
  category: string; // "Quiz", "Test", "Homework", etc
  score?: number; // earned
  totalPoints?: number; // possible
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

export interface AcademicData {
  currentTerm: string;     // e.g., "Q3"
  availableTerms: string[]; // e.g., ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"]
  courses: Course[];
  studentName?: string;
  gpa?: number;
}