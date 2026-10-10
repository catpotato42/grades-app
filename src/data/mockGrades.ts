import { Course, Assignment, AcademicData } from '../types';

//Demo due dates, relative to the moment the app loads.
const dueIn = (minutes: number) => new Date(Date.now() + minutes * 60000).toISOString();
const hours = (h: number) => h * 60;
const days = (d: number) => d * 24 * 60;

//=== NOTIFICATION TEST ===============================================
//Due date for "Unit 7 Test" in AP Calculus BC, in minutes from launch.
//The reminder fires at (due date - minutesAhead), and the default
//minutesAhead is 60, so 65 here means a notification about 5 minutes
//after launch. Set 61 for roughly one minute. Anything under 60 is
//already in the past and will not fire at all.
const NOTIFY_TEST_MINUTES = 65;
//=====================================================================

export const MOCK_DATA: AcademicData = {
  //demo dataset; not real grades
  currentTerm: "SP26",
  terms: [
    { id: "FA25", title: "Fall 2025" },
    { id: "SP26", title: "Spring 2026" },
    { id: "AY25", title: "2025-26", subTermIds: ["FA25", "SP26"] },
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
      teacher: "Marie Alvarez",
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
      title: "AP Human Geography",
      credits: 1.0,
      teacher: "Tom Becker",
      termTitle: "9th Grade",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-bio",
      title: "Biology",
      credits: 1.0,
      finalGrade: { numeric: 88, letter: "B+" },
      teacher: "Linda Park",
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
      id: "cs-383",
      title: "Theory of Computation",
      credits: 1.0,
      teacher: "Arlo Whitfield",
      categoryWeights: [
        { name: "Exams", weight: 0.6 },
        { name: "Problem Sets", weight: 0.3 },
        { name: "Quizzes", weight: 0.1 }
      ],
      officialGrades: {
        "FA25": { numeric: 91, letter: "A-" },
        "AY25": { numeric: 90, letter: "A-" },
        "SP26": { numeric: 90, letter: "A-" }
      },
      //graded work reconciles with the official grade, so no offset here
      assignments: [
        { id: 'toc-1', title: 'Midterm 2', category: 'Exams', score: 85, totalPoints: 100, termId: "SP26", comment: "Clean reduction on problem 3. See me about the last one." },
        { id: 'toc-2', title: 'Pumping Lemma Quiz', category: 'Quizzes', score: 14, totalPoints: 15, termId: "SP26" },
        { id: 'toc-3', title: 'Problem Set 9', category: 'Problem Sets', score: 10, totalPoints: 10, termId: "SP26" },
        //upcoming, ungraded: these drive the Reminders tab and the scheduled notifications
        { id: 'toc-4', title: 'Final Exam', category: 'Exams', totalPoints: 100, termId: "SP26", date: dueIn(NOTIFY_TEST_MINUTES) },
        { id: 'toc-5', title: 'Problem Set 10', category: 'Problem Sets', totalPoints: 10, termId: "SP26", date: dueIn(hours(26)) },
        { id: 'toc-6', title: 'Turing Machines Quiz', category: 'Quizzes', totalPoints: 15, termId: "SP26", date: dueIn(days(4)) }
      ]
    },
    {
      id: "engr-270",
      title: "Analog and Digital Electronics",
      credits: 1.0,
      teacher: "Dana Ruiz",
      categoryWeights: [
        { name: "Exams", weight: 0.7 },
        { name: "Labs", weight: 0.3 }
      ],
      officialGrades: {
        "FA25": { numeric: 88, letter: "B+" },
        "AY25": { numeric: 91, letter: "A-" },
        "SP26": { numeric: 94, letter: "A" }
      },
      //official grade sits well above the graded work, so the offset assignment
      //appears to reconcile them (weighting the API does not expose)
      assignments: [
        { id: 'ade-1', title: 'Midterm Exam', category: 'Exams', score: 70, totalPoints: 100, termId: "SP26" },
        { id: 'ade-2', title: 'Op-Amp Lab', category: 'Labs', score: 26, totalPoints: 30, termId: "SP26" },
        { id: 'ade-3', title: 'Filter Design Lab', category: 'Labs', totalPoints: 40, termId: "SP26", date: dueIn(days(2)) },
        { id: 'ade-4', title: 'Lab Practical', category: 'Exams', totalPoints: 100, termId: "SP26", date: dueIn(days(6)) }
      ]
    },
    {
      id: "cs-347",
      title: "Intro to Machine Learning",
      credits: 1.0,
      teacher: "Priya Raman",
      officialGrades: {
        "FA25": { numeric: 84, letter: "B" },
        "AY25": { numeric: 84 },
        "SP26": { numeric: 81 }
      },
      //a grade with no graded work behind it, so the offset assignment
      //calibrates against it rather than showing nothing
      assignments: [
        { id: 'ml-1', title: 'Gradient Descent Writeup', category: 'None', totalPoints: 50, termId: "SP26", date: dueIn(days(3)) }
      ]
    },
    {
      id: "math-260",
      title: "Intro to Higher Math",
      credits: 1.0,
      teacher: "Emeka Boateng",
      //no Spring grade posted yet, so this one shows the "no data" state
      officialGrades: {
        "FA25": { numeric: 93, letter: "A" },
        "AY25": { numeric: 93, letter: "A" }
      },
      assignments: []
    }
  ]
};