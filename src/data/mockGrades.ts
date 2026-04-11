import { Course, Assignment, AcademicData } from '../types';

export const MOCK_DATA: AcademicData = {
  //gemini-generated mock data
  currentTerm: "Q3-0",
  terms: [
    {
      id: "Q1-0",
      title: "Q1",
    },
    {
      id: "Q2-0",
      title: "Q2",
    },
    {
      id: "S1-0",
      title: "S1",
      subTermIds: ["Q1-0", "Q2-0"]
    },
    {
      id: "Q3-0",
      title: "Q3",
    },
  ],

  pastCourses: [
    {
      id: "pc-eng9",
      title: "Honors English 9",
      credits: 1.0,
      numeric: 95,
      teacher: "Sarah Smith",
      termTitle: "9th Grade"
    },
    {
      id: "pc-bio",
      title: "Biology",
      credits: 1.0,
      numeric: 88,
      letter: "B+",
      teacher: "Hugh Grant",
      termTitle: "9th Grade"
    },
    {
      id: "pc-alg1",
      title: "Algebra 1",
      credits: 1.0,
      letter: "A-",
      teacher: "Robert Miller",
      termTitle: "9th Grade"
    },
    {
      id: "pc-worldhist",
      title: "World History",
      credits: 1.0,
      numeric: 97,
      letter: "A+",
      teacher: "Dan Smith",
      termTitle: "10th Grade"
    },
    {
      id: "pc-chem",
      title: "Chemistry",
      credits: 1.0,
      numeric: 84,
      letter: "B",
      teacher: "Walter White",
      termTitle: "10th Grade"
    },
    {
      id: "pc-geom",
      title: "AP Calculus AB",
      credits: 1.0,
      numeric: 93,
      letter: "A",
      teacher: "Robert Miller",
      termTitle: "10th Grade"
    }
  ],
  courses: [
  //correct
  {
    id: "math-302",
    title: "AP Calculus BC",
    teacher: "Robert Miller",
    period: 1,
    categoryWeights: [
      { name: "Test", weight: 0.6 },
      { name: "Quiz", weight: 0.3 },
      { name: "Homework", weight: 0.1 }
    ],
    officialGrades: {
      "Q1-0": { numeric: 94, letter: "A" },
      "Q2-0": { numeric: 91, letter: "A-" },
      "S1-0": { numeric: 93, letter: "A" },
      "Q3-0": { numeric: 89, letter: "B+" }
    },
    assignments: [
      { 
        id: 'calc-1', 
        title: 'Unit 6 Test', 
        category: 'Test', 
        score: 85, 
        totalPoints: 100, 
        termId: "Q3-0",
        comment: "Good job broski \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n \n scroll test"
      },
      { id: 'calc-2', title: 'Integration Quiz', category: 'Quiz', score: 14, totalPoints: 15, termId: "Q3-0" },
      { id: 'calc-3', title: 'HW #12', category: 'Homework', score: 10, totalPoints: 10, termId: "Q3-0" }
    ]
  },
  //offset needed
  {
    id: "soc-401",
    title: "AP US Government",
    teacher: "Sarah Jenkins",
    period: 2,
    categoryWeights: [
      { name: "Tests", weight: 0.7 },
      { name: "Labs", weight: 0.3 }
    ],
    officialGrades: {
      "Q1-0": { numeric: 98, letter: "A" },
      "Q2-0": { numeric: 65, letter: "D-" },
      "S1-0": { numeric: 90, letter: "A-" },
      "Q3-0": { numeric: 94, letter: "A" }
    },
    assignments: [
      { id: 'gov-1', title: 'Constitution Test', category: 'Tests', score: 70, totalPoints: 100, termId: "Q3-0" },
      { id: 'gov-2', title: 'Bill of Rights Lab', category: 'Labs', score: 26, totalPoints: 30, termId: "Q3-0" }
    ]
  },
  //no assignments
  {
    id: "eng-301",
    title: "AP English Lang (APLA)",
    teacher: "David Attenborough",
    period: 3,
    officialGrades: {
      "Q1-0": { numeric: 84, letter: "B" },
      "Q2-0": {},
      "S1-0": { numeric: 84},
      "Q3-0": { numeric: 81}
    },
    assignments: []
  },
  {
    id: "lang-303",
    title: "AP Spanish 3",
    teacher: "Maria Garcia",
    period: 4,
    officialGrades: {
      "Q1-0": { numeric: 98, letter: "A+" },
      "Q2-0": { numeric: 96, letter: "A" },
      "S1-0": { numeric: 97, letter: "A" },
      "Q3-0": { numeric: 95, letter: "A" }
    },
    assignments: []
  },
  {
    id: "sci-301",
    title: "AP Physics 1",
    teacher: "James Maxwell",
    period: 5,
    officialGrades: {
      "Q1-0": { numeric: 76, letter: "C" },
      "Q2-0": { numeric: 52, letter: "E" },
      "S1-0": { numeric: 74, letter: "C" },
      "Q3-0": { numeric: 78, letter: "C+" }
    },
    assignments: []
  },
  {
    id: "hth-101",
    title: "Health",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    officialGrades: {
      "Q1-0": { numeric: 100, letter: "A+" },
      "Q2-0": { numeric: 99, letter: "A+" },
      "S1-0": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-1",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    officialGrades: {
      "Q1-0": { numeric: 100, letter: "A+" },
      "Q2-0": { numeric: 99, letter: "A+" },
      "S1-0": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-2",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    officialGrades: {
      "Q1-0": { numeric: 100, letter: "A+" },
      "Q2-0": { numeric: 99, letter: "A+" },
      "S1-0": { numeric: 100, letter: "A+" }
    },
    assignments: []
  },
  {
    id: "scroll-test-3",
    title: "Scroll Test and Length of Class Name Test",
    //no teacher intentionally to test
    period: 6,
    // Semester 1 course: Data exists for Q1/Q2/S1, but empty for Q3/Q4/S2
    officialGrades: {
      "Q1-0": { numeric: 100, letter: "A+" },
      "Q2-0": { numeric: 99, letter: "A+" },
      "S1-0": { numeric: 100, letter: "A+" }
    },
    assignments: []
  }
]
};