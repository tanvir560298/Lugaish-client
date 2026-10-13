import { availableResources } from './resourcePolicy.js';
export { drivePreviewUrl } from './resourcePolicy.js';
import { api } from '../api/client.js';
export const SAMPLE_READING = {
  id: 'local-reading', title: 'Practice: introduce yourself', type: 'reading',
  description: 'A short practice activity for this local preview.',
};
export async function loadStudyResources(course) {
  const catalog = await api.getCourses();
  if (!catalog.some(c => c.language === course && c.status === 'published')) return [];
  const plan = await api.getDayModules(course);
  const lessons = await Promise.all((plan.modules || []).filter(m => m.published && m.available && !m.premiumLocked).map(m => api.getLesson(course, m.day).catch(() => null)));
  return lessons.flatMap(l => l ? (l.materials || []).map(r => ({...r, day:l.day})) : []);
}
export async function authorizeResource(course, resource) {
  const lesson = await api.getLesson(course, resource.day);
  const actual = lesson.materials?.find(r => r.id === resource.id && r.url === resource.url);
  if (!actual) throw new Error('This material is no longer published for your lesson.');
  return {...actual, day:lesson.day};
}
