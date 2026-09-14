// Starter curriculum plan templates for Tanvir Ahmad's 3 official courses
export const DEFAULT_COURSE_PLANS = {
  'tanvir-spoken-english-fluency': [
    {
      day: 1,
      title: 'Phonetic Foundations & Hesitation Breakdown',
      studyTopic: 'Vowel length, rhythm patterns, and eliminating vocal fillers (uh, um) during conversation.',
      studentOutput: 'Record a 60-second spontaneous self-introduction audio without hesitation.',
      actionType: 'ai_speaking',
      actionLabel: 'Launch AI Pronunciation Drill',
      actionTarget: '/speaking-practice?language=english&day=1',
      status: 'published',
    },
    {
      day: 2,
      title: 'Everyday Functional Phrases & Active Listening',
      studyTopic: '15 conversational connectors to naturally ask follow-up questions in business and daily life.',
      studentOutput: 'Shadow and repeat 10 real-world dialogue situations with native intonation.',
      actionType: 'pdf_resource',
      actionLabel: 'Open Functional Phrases PDF',
      actionTarget: '/lesson/2',
      status: 'published',
    },
    {
      day: 3,
      title: 'Spontaneous Speech: 2-Minute JAM Sessions',
      studyTopic: 'Just-A-Minute (JAM) technique for formulating instant thoughts without translation lag.',
      studentOutput: 'Continuous 2-minute speech on a surprise topic evaluated by AI speech recognition.',
      actionType: 'ai_speaking',
      actionLabel: 'Start 2-Min Speech Drill',
      actionTarget: '/speaking-practice?language=english&day=3',
      status: 'published',
    },
    {
      day: 4,
      title: 'Grammar in Action: Past Tense Storytelling',
      studyTopic: 'Using narrative tenses (Past Simple vs Continuous) to tell compelling life stories.',
      studentOutput: 'Complete story completion exercise and correct past tense verb pitfalls.',
      actionType: 'quiz',
      actionLabel: 'Take Storytelling Check Quiz',
      actionTarget: '/quiz?language=english&day=4',
      status: 'published',
    },
    {
      day: 5,
      title: 'Live Dialogue Simulation: Disagreeing Politely',
      studyTopic: 'Expressing contrary opinions with diplomacy and professional vocabulary in meetings.',
      studentOutput: '1-on-1 interactive mock dialogue with live mentor and peers.',
      actionType: 'mock_interview',
      actionLabel: 'Join Speaking Room Simulation',
      actionTarget: '/interview?language=english&day=5',
      status: 'published',
    },
  ],
  'tanvir-ielts-comprehensive-band-7': [
    {
      day: 1,
      title: 'IELTS Band 7+ Rubric & Speaking Part 1 Mastery',
      studyTopic: 'Deconstructing the 4 IELTS speaking descriptors: Fluency, Lexis, Grammar, Pronunciation.',
      studentOutput: 'Diagnostic recording of 6 Speaking Part 1 topics with lexical variety.',
      actionType: 'ai_speaking',
      actionLabel: 'Start Band 7 Speaking Diagnostic',
      actionTarget: '/speaking-practice?language=english&day=1',
      status: 'published',
    },
    {
      day: 2,
      title: 'Writing Task 2: Band 7+ Essay Formulas',
      studyTopic: 'Agree/Disagree & Discussion essay architecture: Clear thesis statements and PEEL paragraphs.',
      studentOutput: 'Full 250-word Task 2 essay outline and topic sentence formulation.',
      actionType: 'pdf_resource',
      actionLabel: 'Download Task 2 Formula PDF',
      actionTarget: '/lesson/2',
      status: 'published',
    },
    {
      day: 3,
      title: 'Reading: Skimming & Scanning Under Time Pressure',
      studyTopic: 'Targeting True/False/Not Given and Headings match in under 18 minutes per passage.',
      studentOutput: 'Complete timed 13-question academic reading section with detailed rationale.',
      actionType: 'quiz',
      actionLabel: 'Start Timed Reading Drill',
      actionTarget: '/quiz?language=english&day=3',
      status: 'published',
    },
    {
      day: 4,
      title: 'Listening: Section 3 & 4 Accent & Distractor Traps',
      studyTopic: 'Overcoming multiple speakers, Australian/British phonetic shifts, and self-correction traps.',
      studentOutput: 'Section 4 lecture note-taking with zero spelling errors.',
      actionType: 'video_lecture',
      actionLabel: 'Play Section 4 Audio Drill',
      actionTarget: '/lesson/4',
      status: 'published',
    },
    {
      day: 5,
      title: 'Speaking Part 2: 2-Minute Cue Card Strategy',
      studyTopic: 'The 1-minute prep method: Brainstorming PPF (Past, Present, Future) to never run out of ideas.',
      studentOutput: 'Complete 2-minute unscripted cue card monologue with complex connective clauses.',
      actionType: 'mock_interview',
      actionLabel: 'Simulate Full Cue Card Test',
      actionTarget: '/interview?language=english&day=5',
      status: 'published',
    },
  ],
  'tanvir-ielts-foundation-band-6': [
    {
      day: 1,
      title: 'Sentence Structures: Simple, Compound & Complex',
      studyTopic: 'Mastering coordinating (FANBOYS) and subordinating conjunctions to eliminate run-on sentences.',
      studentOutput: '15 sentence transformation drills creating error-free complex clauses.',
      actionType: 'pdf_resource',
      actionLabel: 'Open Grammar Foundation PDF',
      actionTarget: '/lesson/1',
      status: 'published',
    },
    {
      day: 2,
      title: 'Essential 500 Academic Word List (AWL) Part 1',
      studyTopic: 'Top 25 AWL sublist words with correct collocations and prepositions.',
      studentOutput: 'Vocabulary retention test with sentence creation drills.',
      actionType: 'quiz',
      actionLabel: 'Start Academic Word Quiz',
      actionTarget: '/quiz?language=english&day=2',
      status: 'published',
    },
    {
      day: 3,
      title: 'Basic Listening: Number, Name & Spelling Traps',
      studyTopic: 'Double consonants, vowels (A/E/I), postcode formats, and telephone numbering rules.',
      studentOutput: '100% accuracy on Section 1 registration form filling audio simulation.',
      actionType: 'video_lecture',
      actionLabel: 'Play Listening Form-Fill Drill',
      actionTarget: '/lesson/3',
      status: 'published',
    },
    {
      day: 4,
      title: 'Speaking with Confidence: Everyday Q&A Drills',
      studyTopic: 'Expanding 1-word responses into 3-sentence answers using Reason + Example formula.',
      studentOutput: 'Record answers to 8 general questions demonstrating sentence expansion.',
      actionType: 'ai_speaking',
      actionLabel: 'Practice Everyday Q&A With AI',
      actionTarget: '/speaking-practice?language=english&day=4',
      status: 'published',
    },
    {
      day: 5,
      title: 'Writing Task 1 Basics: Bar Charts & Trends',
      studyTopic: 'Writing an effective Overview paragraph and vocabulary for increase/decrease/fluctuation.',
      studentOutput: 'Draft a 150-word Task 1 report with trend verbs and prepositions.',
      actionType: 'pdf_resource',
      actionLabel: 'Open Task 1 Guide & Templates',
      actionTarget: '/lesson/5',
      status: 'published',
    },
  ],
};

// Official courses offered and instructed by Tanvir Ahmad
export const DEFAULT_TANVIR_COURSES = [
  {
    id: 'tanvir-spoken-english-fluency',
    title: 'Spoken English for Daily Fluency',
    subtitle: '3-Month Intensive Daily Fluency & Conversational Mastery',
    duration: '3 Months',
    instructor: 'Tanvir Ahmad',
    category: 'Spoken English',
    format: 'Live Speaking Drills & Studio Practice',
    status: 'enrolling', // 'active' | 'enrolling' | 'upcoming' | 'draft'
    totalDays: 90,
    seatLimit: 15,
    enrolledCount: 0,
    schedule: '3 Days / Week • 8:00 PM - 9:30 PM (Dhaka Time)',
    venue: 'Lugaish Digital Portal / Live Studio',
    price: 'Paid Cohort (Announced Soon)',
    description: 'A 3-month comprehensive spoken English program designed and personally instructed by Tanvir Ahmad. Emphasizes real-life conversational drills, accent and pronunciation clarity, spontaneous speech generation, and removing hesitation in professional and everyday environments.',
    tags: ['3 Months', 'Daily Fluency', 'Pronunciation', 'Hesitation Removal'],
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'tanvir-ielts-comprehensive-band-7',
    title: 'IELTS Comprehensive Mastery: Target Band 7',
    subtitle: '4-Month Intensive Academic & General Training for Band 7+',
    duration: '4 Months',
    instructor: 'Tanvir Ahmad',
    category: 'IELTS Preparation',
    format: 'Live Drills & 1-on-1 Mock Evaluation',
    status: 'enrolling',
    totalDays: 120,
    seatLimit: 12,
    enrolledCount: 0,
    schedule: '3 Days / Week • 7:30 PM - 9:30 PM (Dhaka Time)',
    venue: 'Lugaish Interactive Studio & Evaluation Labs',
    price: 'Paid Cohort (Announced Soon)',
    description: 'A 4-month structured IELTS masterclass instructed by Tanvir Ahmad targeting Band 7+. Delivers rigorous, strategy-driven preparation across all four modules: high-scoring Speaking interview drills, formulaic Writing Task 1 & 2 essay feedback, rapid Reading scanning techniques, and audio Listening simulations.',
    tags: ['4 Months', 'Target Band 7', 'IELTS Mastery', 'Mock Interviews', 'Task 1 & 2'],
    createdAt: '2026-09-05T00:00:00.000Z',
  },
  {
    id: 'tanvir-ielts-foundation-band-6',
    title: 'IELTS Foundation to Band 6: Step-by-Step Bridge',
    subtitle: '6-Month Complete Beginner-to-Intermediate IELTS Bridge Program',
    duration: '6 Months',
    instructor: 'Tanvir Ahmad',
    category: 'IELTS Foundation',
    format: 'Foundation Modules & Live Practice',
    status: 'upcoming',
    totalDays: 180,
    seatLimit: 20,
    enrolledCount: 0,
    schedule: '3 Days / Week • 6:30 PM - 8:00 PM (Dhaka Time)',
    venue: 'Lugaish Interactive Studio & Evaluation Labs',
    price: 'Paid Cohort (Announced Soon)',
    description: 'A 6-month foundational stepping-stone course instructed by Tanvir Ahmad for learners starting with English gaps and wanting a clear, reliable pathway to Band 6+. Systematically strengthens grammar foundations, everyday vocabulary bank, sentence structures, and phonetics before bridging into official IELTS examination formats.',
    tags: ['6 Months', 'Foundation to Band 6', 'Step-by-Step', 'Grammar Core', 'Vocabulary Bank'],
    createdAt: '2026-09-10T00:00:00.000Z',
  },
];

const STORAGE_KEY = 'lugaish_tanvir_courses_v3';

export function loadTanvirCourses() {
  if (typeof window === 'undefined') return DEFAULT_TANVIR_COURSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_TANVIR_COURSES));
      return DEFAULT_TANVIR_COURSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_TANVIR_COURSES;
  } catch {
    return DEFAULT_TANVIR_COURSES;
  }
}

export function saveTanvirCourses(courses) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  } catch (err) {
    console.error('Failed to save Tanvir courses to localStorage', err);
  }
}

export function loadCoursePlan(courseId) {
  if (typeof window === 'undefined') return DEFAULT_COURSE_PLANS[courseId] || [];
  try {
    const raw = localStorage.getItem(`lugaish_plan_${courseId}_v1`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
    const initial = DEFAULT_COURSE_PLANS[courseId] || [];
    localStorage.setItem(`lugaish_plan_${courseId}_v1`, JSON.stringify(initial));
    return initial;
  } catch {
    return DEFAULT_COURSE_PLANS[courseId] || [];
  }
}

export function saveCoursePlan(courseId, plan) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`lugaish_plan_${courseId}_v1`, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save course plan to localStorage', err);
  }
}
