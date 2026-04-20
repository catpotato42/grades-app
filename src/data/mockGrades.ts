import { Course, Assignment, AcademicData } from '../types';

export const MOCK_DATA: AcademicData = {
  //gemini-generated mock data
  currentTerm: "Q3-0",
  terms: [
    { id: "Q1-0", title: "Q1", absences: 20 },
    { id: "Q2-0", title: "Q2" },
    { id: "S1-0", title: "S1", subTermIds: ["Q1-0", "Q2-0"] },
    { id: "Q3-0", title: "Q3", absences: 1 },
  ],
  courses: [
    // --- PAST COURSES ---
    {
      id: "pc-worldhist",
      title: "World History",
      credits: 1.0,
      finalGrade: { numeric: 97, letter: "A+" },
      teacher: "Dan Smith",
      termTitle: "10th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-chem",
      title: "Chemistry",
      credits: 1.0,
      finalGrade: { numeric: 84, letter: "B" },
      teacher: "Walter White",
      termTitle: "10th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-geom",
      title: "AP Calculus AB",
      credits: 1.0,
      finalGrade: { numeric: 93, letter: "A" },
      teacher: "Robert Miller",
      termTitle: "10th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-eng9",
      title: "Honors English 9",
      credits: 1.0,
      finalGrade: { numeric: 95 },
      teacher: "Sarah Smith",
      termTitle: "9th Grade",
      officialGrades: {},
      absences: 40,
      assignments: [],
    },
    {
      id: "bull-noth",
      title: "AP Nothing",
      credits: 1.0,
      teacher: "Jerry Standhaven",
      termTitle: "9th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-bio",
      title: "Biology",
      credits: 1.0,
      finalGrade: { numeric: 88, letter: "B+" },
      teacher: "Hugh Grant",
      termTitle: "9th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-alg1",
      title: "Algebra 1",
      credits: 1.0,
      finalGrade: { letter: "A-" },
      teacher: "Robert Miller",
      termTitle: "9th Grade",
      officialGrades: {},
      absences: 10,
      assignments: [],
    },
    // --- CURRENT COURSES ---
    {
      id: "math-302",
      title: "AP Calculus BC",
      credits: 1.0,
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
        { id: 'calc-1', title: 'Unit 6 Test', category: 'Test', score: 85, totalPoints: 100, termId: "Q3-0", comment: "Good job broski\n\n\n\n\n\n\n\n\n\nscroll test" },
        { id: 'calc-2', title: 'Integration Quiz', category: 'Quiz', score: 14, totalPoints: 15, termId: "Q3-0" },
        { id: 'calc-3', title: 'HW #12', category: 'Homework', score: 10, totalPoints: 10, termId: "Q3-0" }
      ]
    },
    {
      id: "soc-401",
      title: "AP US Government",
      credits: 0.5, // <-- Set to 0.5 to test half-credit GPA weighting
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
      absences: 10,
      assignments: [
        { id: 'gov-1', title: 'Constitution Test', category: 'Tests', score: 70, totalPoints: 100, termId: "Q3-0" },
        { id: 'gov-2', title: 'Bill of Rights Lab', category: 'Labs', score: 26, totalPoints: 30, termId: "Q3-0" }
      ]
    },
    {
      id: "eng-301",
      title: "AP English Lang (APLA)",
      credits: 1.0,
      teacher: "David Attenborough",
      period: 3,
      officialGrades: {
        "Q1-0": { numeric: 84, letter: "B" },
        "Q2-0": {},
        "S1-0": { numeric: 84 },
        "Q3-0": { numeric: 81 }
      },
      assignments: []
    },
    {
      id: "hth-101",
      title: "Health",
      credits: 0.5,
      period: 6,
      officialGrades: {
        "Q1-0": { numeric: 100, letter: "A+" },
        "Q2-0": { numeric: 99, letter: "A+" },
        "S1-0": { numeric: 100, letter: "A+" }
      },
      assignments: []
    }
  ]
};