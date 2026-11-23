// Browser-local learning progress, independent of old manual study marks.
export const htmlProgressKey = scope => `lugaish_html_playback_v2:${scope}`;
export function cleanCoverage(value, duration) {
  if (!Number.isFinite(duration) || duration <= 0) return [];
  return [...new Set((Array.isArray(value) ? value : []).filter(n => Number.isInteger(n) && n >= 0 && n < Math.ceil(duration)))];
}
export function recordPlayback(covered, previous, current, duration, elapsed) {
  const result = new Set(cleanCoverage(covered, duration));
  const delta = current - previous;
  // Poll every 500 ms. Scrubbing and replaying a section cannot earn new watch time.
  if (![previous, current, elapsed].every(Number.isFinite) || previous < 0 || delta <= 0 || elapsed <= 0 || elapsed > 2 || delta > elapsed * 2.1 + 0.2 || current > duration + 0.5) return [...result];
  for (let n = Math.ceil(previous); n < current; n++) if (n < Math.ceil(duration)) result.add(n);
  return [...result];
}
export function watchedFraction(covered, duration) {
  return duration > 0 ? Math.min(1, cleanCoverage(covered, duration).length / Math.ceil(duration)) : 0;
}
export function canCompletePlayback(covered, duration, current) {
  return duration > 0 && current >= duration - 1 && watchedFraction(covered, duration) >= 0.95;
}
