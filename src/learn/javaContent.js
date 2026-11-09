// Java Programming Course Content & Curriculum
// Reset state: ready for new curriculum and lessons by Tanvir Ahmad.

import { nestedLoopsPracticeProblems } from './nestedLoopsPracticeData.js';
export { nestedLoopsPracticeProblems };

// Array of Java video classes (empty - ready for new classes)
export const javaVideos = [];

// Interactive practice problems mapped by class id
export const javaPracticeProblems = {};

// Clean and sanitize progress IDs from localStorage
export function cleanJavaProgress(value) {
  return [...new Set((Array.isArray(value) ? value : []).filter(id => javaVideos.some(v => v.id === id)))];
}

// Sequential unlocking: First class is unlocked for everyone.
// Subsequent classes unlock once the preceding class is completed.
export function isJavaClassUnlocked(classId, completedList = []) {
  if (!javaVideos || javaVideos.length === 0) return false;
  if (classId === javaVideos[0]?.id) return true;
  const idx = javaVideos.findIndex(v => v.id === classId);
  if (idx <= 0) return false;
  const previousClassId = javaVideos[idx - 1].id;
  return completedList.includes(previousClassId);
}

// Helper to determine the first uncompleted unlocked class
export function getNextUnlockedJavaClass(completedList = []) {
  if (!javaVideos || javaVideos.length === 0) return null;
  for (const video of javaVideos) {
    if (!completedList.includes(video.id) && isJavaClassUnlocked(video.id, completedList)) {
      return video;
    }
  }
  return javaVideos[0] || null;
}
