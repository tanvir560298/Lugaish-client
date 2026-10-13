export const DEFAULT_COURSE_PLANS = {};
export const DEFAULT_TANVIR_COURSES = [];
export const IELTS_BAND_7_MONTH_THEMES = {};
export const IELTS_FOUNDATION_BAND_6_MONTH_THEMES = {};
export const SPOKEN_ENGLISH_MONTH_THEMES = {};
const STORAGE_KEY = 'lugaish_tanvir_courses_v8';

export function loadTanvirCourses() {
  // v7 remains recoverable browser history; it is never an active catalog.
  if (typeof window === 'undefined') return [];
  try { const saved = JSON.parse(localStorage.getItem('lugaish_tanvir_courses_v8') || '[]'); return Array.isArray(saved) ? saved : []; }
  catch { return []; }
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
  if (typeof window === 'undefined' || !loadTanvirCourses().some(course => course.id === courseId)) return [];
  try { const saved = JSON.parse(localStorage.getItem(`lugaish_plan_${courseId}_v9`) || '[]'); return Array.isArray(saved) ? saved : []; }
  catch { return []; }
}

export function saveCoursePlan(courseId, plan) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`lugaish_plan_${courseId}_v9`, JSON.stringify(plan));
  } catch (err) {
    console.error('Failed to save course plan to localStorage', err);
  }
}
