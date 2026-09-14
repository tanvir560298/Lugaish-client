// Initial courses offered and conducted by Tanvir Ahmad
export const DEFAULT_TANVIR_COURSES = [
  {
    id: 'tanvir-in-person-dhaka',
    title: 'Private In-Person Immersion Cohort (Dhaka)',
    subtitle: 'Physical Language Mastery & Speaking Drills',
    instructor: 'Tanvir Ahmad',
    coInstructor: 'Ishaat Alhumaidi',
    category: 'Language Immersion',
    format: 'In-Person (Dhaka Hub)',
    status: 'enrolling', // 'active' | 'enrolling' | 'upcoming' | 'draft'
    totalDays: 45,
    seatLimit: 12,
    enrolledCount: 8,
    schedule: 'Fri & Sat • 6:30 PM - 8:30 PM',
    venue: 'Lugaish Learning Hub, Banani / Dhanmondi, Dhaka',
    price: '4,500 BDT',
    description: 'An exclusive face-to-face intensive language immersion cohort in Dhaka with direct mentorship from Tanvir Ahmad & Ishaat Alhumaidi. Strictly capped at 12 seats with printed workbooks and live mock interview drills.',
    tags: ['In-Person', 'Small Batch (12)', 'Dual Mentorship'],
    createdAt: '2026-08-15T00:00:00.000Z',
  },
  {
    id: 'tanvir-english-spelling-mastery',
    title: 'English Spelling & Core Rules Masterclass',
    subtitle: '30-Day Phonics, Root Words & Morphology Ascent',
    instructor: 'Tanvir Ahmad',
    category: 'Spelling Masterclass',
    format: 'Online Ascent',
    status: 'active',
    totalDays: 30,
    seatLimit: 100,
    enrolledCount: 42,
    schedule: 'Daily 10-Minute Ascent Modules',
    venue: 'Lugaish Digital Portal',
    price: 'Free (Founding Access)',
    description: 'A 30-day foundational curriculum covering high-frequency spelling patterns, silent letters, Latin/Greek roots, and daily confidence challenges designed and maintained by Tanvir Ahmad.',
    tags: ['Online', 'Daily Modules', 'Automated Quizzes'],
    createdAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'tanvir-web-engineering-ai',
    title: 'Web Engineering & AI Interactive Systems',
    subtitle: 'Modern Full-Stack Applications & Intelligent Tooling',
    instructor: 'Tanvir Ahmad',
    category: 'Technology',
    format: 'Hybrid / Live Drills',
    status: 'upcoming',
    totalDays: 60,
    seatLimit: 20,
    enrolledCount: 5,
    schedule: 'Mon & Wed • 8:00 PM - 10:00 PM',
    venue: 'Virtual Classroom + Coding Labs',
    price: '3,000 BDT',
    description: 'Comprehensive software engineering and AI systems building course. Learn how to architect real-time interactive portals, LLM agent integration, reactive interfaces, and scalable production systems.',
    tags: ['Tech & AI', 'Interactive Labs', 'Project-Based'],
    createdAt: '2026-09-01T00:00:00.000Z',
  },
];

const STORAGE_KEY = 'lugaish_tanvir_courses_v1';

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
