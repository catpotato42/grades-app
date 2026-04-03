import { Course, Assignment, SkywardData } from '../types'; // Adjust path if needed

export const MOCK_DATA: SkywardData = {
  currentTerm: "Q3",
  availableTerms: ["Q1", "Q2", "S1", "Q3", "Q4", "S2", "FIN"],
  courses: [
    {
      id: "math-101",
      title: "Algebra II",
      teacher: "Mary Johnson",
      period: 1,
      grades: {
        "Q1": { numeric: 92, letter: "A-" },
        "Q3": { numeric: 95, letter: "A" }
      },
      assignments: []
    },
    {
      id: "gov-401",
      title: "US Government",
      teacher: "John Smith",
      period: 2,
      grades: {
        "Q3": { numeric: 88, letter: "B+" }
      },
      assignments: []
    }
  ]
};