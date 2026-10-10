import { Course, Assignment, AcademicData } from '../types';

//Demo due dates, relative to the moment the app loads.
const dueIn = (minutes: number) => new Date(Date.now() + minutes * 60000).toISOString();
const hours = (h: number) => h * 60;
const days = (d: number) => d * 24 * 60;

//=== NOTIFICATION TEST ===============================================
//Due date for "Final Practical" in Intro to Clowning, in minutes from
//launch. The reminder fires at (due date - minutesAhead), and the
//default minutesAhead is 60, so 65 here means a notification about 5
//minutes after launch. Set 61 for roughly one minute. Anything under
//60 is already in the past and will not fire at all.
const NOTIFY_TEST_MINUTES = 65;
//=====================================================================

//Demo dataset. The course names are deliberately fictional so nobody
//mistakes a screenshot for a real transcript. Current-term grades span
//A through F on purpose, to exercise every grade colour.
export const MOCK_DATA: AcademicData = {
  currentTerm: "SP26",
  terms: [
    { id: "FA25", title: "Fall 2025" },
    { id: "SP26", title: "Spring 2026" },
    { id: "AY25", title: "2025-26", subTermIds: ["FA25", "SP26"] },
  ],
  courses: [
    // --- PAST COURSES (archive) ---
    {
      id: "pc-gargoyle",
      title: "AP Gargoyle Studies",
      credits: 1.0,
      finalGrade: { numeric: 97, letter: "A+" },
      teacher: "Dan Smith",
      termTitle: "Sophomore Year",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-cheese",
      title: "Honors Cheese Cave Management",
      credits: 1.0,
      finalGrade: { numeric: 84, letter: "B" },
      teacher: "Marie Alvarez",
      termTitle: "Sophomore Year",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-semaphore",
      title: "AP Semaphore and Flag Signalling",
      credits: 1.0,
      finalGrade: { numeric: 93, letter: "A" },
      teacher: "Robert Miller",
      termTitle: "Sophomore Year",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-horology",
      title: "Introductory Horology",
      credits: 1.0,
      finalGrade: { numeric: 95 },
      teacher: "Sarah Smith",
      termTitle: "First Year",
      officialGrades: {},
      absences: 40,
      assignments: [],
    },
    {
      id: "pc-mime",
      title: "AP Mime Theory",
      credits: 1.0,
      teacher: "Tom Becker",
      termTitle: "First Year",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-pneumatic",
      title: "Pneumatic Tube Systems",
      credits: 1.0,
      finalGrade: { numeric: 88, letter: "B+" },
      teacher: "Linda Park",
      termTitle: "First Year",
      officialGrades: {},
      assignments: [],
    },
    {
      id: "pc-cooperage",
      title: "Barrel Cooperage I",
      credits: 1.0,
      finalGrade: { letter: "A-" },
      teacher: "Robert Miller",
      termTitle: "First Year",
      officialGrades: {},
      absences: 10,
      assignments: [],
    },
    // --- CURRENT COURSES ---
    // A: graded work reconciles with the official grade, so no offset here
    {
      id: "clw-101",
      title: "Intro to Clowning",
      credits: 1.0,
      teacher: "Arlo Whitfield",
      categoryWeights: [
        { name: "Practicals", weight: 0.6 },
        { name: "Studio Work", weight: 0.3 },
        { name: "Quizzes", weight: 0.1 }
      ],
      officialGrades: {
        "FA25": { numeric: 91, letter: "A-" },
        "AY25": { numeric: 90, letter: "A-" },
        "SP26": { numeric: 90, letter: "A-" }
      },
      assignments: [
        { id: 'clw-1', title: 'Midterm Practical', category: 'Practicals', score: 85, totalPoints: 100, termId: "SP26", comment: "Timing on the pratfall is much improved. Watch the slide whistle." },
        { id: 'clw-2', title: 'Balloon Animal Quiz', category: 'Quizzes', score: 14, totalPoints: 15, termId: "SP26" },
        { id: 'clw-3', title: 'Studio Journal 9', category: 'Studio Work', score: 10, totalPoints: 10, termId: "SP26" },
        //upcoming, ungraded: these drive the Reminders tab and the scheduled notifications
        { id: 'clw-4', title: 'Final Practical', category: 'Practicals', totalPoints: 100, termId: "SP26", date: dueIn(NOTIFY_TEST_MINUTES) },
        { id: 'clw-5', title: 'Studio Journal 10', category: 'Studio Work', totalPoints: 10, termId: "SP26", date: dueIn(hours(26)) },
        { id: 'clw-6', title: 'Greasepaint Quiz', category: 'Quizzes', totalPoints: 15, termId: "SP26", date: dueIn(days(4)) }
      ]
    },
    // B: unweighted total points, also reconciles
    {
      id: "twm-210",
      title: "Typewriter Manufacture",
      credits: 1.0,
      teacher: "Dana Ruiz",
      officialGrades: {
        "FA25": { numeric: 88, letter: "B+" },
        "AY25": { numeric: 86, letter: "B" },
        "SP26": { numeric: 84, letter: "B" }
      },
      assignments: [
        { id: 'twm-1', title: 'Platen Alignment', score: 42, totalPoints: 50, category: 'None', termId: "SP26" },
        { id: 'twm-2', title: 'Typebar Assembly', score: 42, totalPoints: 50, category: 'None', termId: "SP26" },
        { id: 'twm-3', title: 'Carriage Return Mechanism', totalPoints: 50, category: 'None', termId: "SP26", date: dueIn(days(2)) }
      ]
    },
    // C: official grade sits above the graded work, so the offset assignment
    // appears to reconcile them (weighting the API does not expose)
    {
      id: "zep-340",
      title: "Zeppelin Navigation",
      credits: 1.0,
      teacher: "Priya Raman",
      categoryWeights: [
        { name: "Exams", weight: 0.7 },
        { name: "Labs", weight: 0.3 }
      ],
      officialGrades: {
        "FA25": { numeric: 79, letter: "C+" },
        "AY25": { numeric: 77, letter: "C+" },
        "SP26": { numeric: 75, letter: "C" }
      },
      assignments: [
        { id: 'zep-1', title: 'Dead Reckoning Exam', category: 'Exams', score: 60, totalPoints: 100, termId: "SP26" },
        { id: 'zep-2', title: 'Mooring Mast Lab', category: 'Labs', score: 24, totalPoints: 30, termId: "SP26" },
        { id: 'zep-3', title: 'Ballast Trim Lab', category: 'Labs', totalPoints: 40, termId: "SP26", date: dueIn(days(6)) }
      ]
    },
    // D: a grade with no graded work behind it, so the offset assignment
    // calibrates against it rather than showing nothing
    {
      id: "dow-115",
      title: "Competitive Dowsing",
      credits: 1.0,
      teacher: "Emeka Boateng",
      officialGrades: {
        "FA25": { numeric: 71, letter: "C-" },
        "AY25": { numeric: 68, letter: "D+" },
        "SP26": { numeric: 64, letter: "D" }
      },
      assignments: [
        { id: 'dow-1', title: 'Field Survey Writeup', category: 'None', totalPoints: 50, termId: "SP26", date: dueIn(days(3)) }
      ]
    },
    // F
    {
      id: "vnt-220",
      title: "Advanced Ventriloquism",
      credits: 1.0,
      teacher: "Jess Okonkwo",
      officialGrades: {
        "FA25": { numeric: 61, letter: "D-" },
        "AY25": { numeric: 56, letter: "F" },
        "SP26": { numeric: 52, letter: "F" }
      },
      assignments: [
        { id: 'vnt-1', title: 'Lip Control Exam', category: 'None', score: 26, totalPoints: 50, termId: "SP26" },
        { id: 'vnt-2', title: 'Distant Voice Recital', category: 'None', totalPoints: 50, termId: "SP26", date: dueIn(days(5)) }
      ]
    },
    // no Spring grade posted yet, so this one shows the "no data" state
    {
      id: "lho-130",
      title: "Lighthouse Operation",
      credits: 1.0,
      teacher: "Nils Haugen",
      officialGrades: {
        "FA25": { numeric: 93, letter: "A" },
        "AY25": { numeric: 93, letter: "A" }
      },
      assignments: []
    }
  ]
};
