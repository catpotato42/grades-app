import { Course, Assignment, AcademicData } from '../types';

export const MOCK_DATA: AcademicData = {
  currentTerm: "Q3",
  availableTerms: ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"],
  //gemini-generated mock data
  courses: [
  {
    id: "math-302",
    title: "AP Calculus BC",
    teacher: "Robert Miller",
    period: 1,
    grades: {
      "Q1": { numeric: 94, letter: "A" },
      "Q2": { numeric: 91, letter: "A-" },
      "S1": { numeric: 93, letter: "A" },
      "Q3": { numeric: 89, letter: "B+" }
    },
    assignments: []
  },
  {
    id: "soc-401",
    title: "AP US Government",
    teacher: "Sarah Jenkins",
    period: 2,
    grades: {
      "Q1": { numeric: 98, letter: "A" },
      "Q2": { numeric: 65, letter: "D-" },
      "S1": { numeric: 90, letter: "A-" },
      "Q3": { numeric: 94, letter: "A" }
    },
    assignments: []
  },
  {
    id: "eng-301",
    title: "AP English Lang (APLA)",
    teacher: "David Attenborough",
    period: 3,
    grades: {
      "Q1": { numeric: 85, letter: "B" },
      "Q2": { numeric: 82, letter: "B-" },
      "S1": { numeric: 84, letter: "B" },
      "Q3": { numeric: 81, letter: "B-" }
    },
    assignments: []
  },
  {
    id: "lang-303",
    title: "AP Spanish 3",
    teacher: "Maria Garcia",
    period: 4,
    grades: {
      "Q1": { numeric: 98, letter: "A+" },
      "Q2": { numeric: 96, letter: "A" },
      "S1": { numeric: 97, letter: "A" },
      "Q3": { numeric: 95, letter: "A" }
    },
    assignments: []
  },
  {
    id: "sci-301",
    title: "AP Physics 1",
    teacher: "James Maxwell",
    period: 5,
    grades: {
      "Q1": { numeric: 76, letter: "C" },
      "Q2": { numeric: 52, letter: "E" },
      "S1": { numeric: 74, letter: "C" },
      "Q3": { numeric: 78, letter: "C+" }
    },
    assignments: []
  },
  {
    id: "hth-101",
    title: "Health",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    grades: {
      "Q1": { numeric: 100, letter: "A+" },
      "Q2": { numeric: 99, letter: "A+" },
      "S1": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-1",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    grades: {
      "Q1": { numeric: 100, letter: "A+" },
      "Q2": { numeric: 99, letter: "A+" },
      "S1": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-2",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    grades: {
      "Q1": { numeric: 100, letter: "A+" },
      "Q2": { numeric: 99, letter: "A+" },
      "S1": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-3",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    grades: {
      "Q1": { numeric: 100, letter: "A+" },
      "Q2": { numeric: 99, letter: "A+" },
      "S1": { numeric: 100, letter: "A+" }
    },
    assignments: []
  }
]
};