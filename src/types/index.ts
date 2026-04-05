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
  date?: string; // date assigned/completed
  comment?: string;
}

export interface Course {
  id: string; // sourcedId from Skyward
  title: string;
  period?: number;
  room?: string;
  teacher?: string;
  grades: Record<string, TermGrade>;
  assignments: Assignment[]
}

export interface AcademicData {
  currentTerm: string;     // e.g., "Q3"
  availableTerms: string[]; // e.g., ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"]
  courses: Course[];
  //future proofing:
  studentName?: string;
  gpa?: number;
}