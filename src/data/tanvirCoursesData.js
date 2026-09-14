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
