export const COURSE_START_DATE_KEY = '2026-08-01';
export const COURSE_START_DATE = new Date('2026-08-01T00:00:00+06:00');

export function hasCourseStarted(now = new Date()) {
  return now.getTime() >= COURSE_START_DATE.getTime();
}

export function getEffectiveCourseStartKey(savedStartKey) {
  if (!savedStartKey || savedStartKey < COURSE_START_DATE_KEY) {
    return COURSE_START_DATE_KEY;
  }

  return savedStartKey;
}
