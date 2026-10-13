export const FOCUS_MINUTES = [15, 25, 45];
export const DEFAULT_GOAL = 'Read a lesson and write down three things I learned.';
export function createTimer(minutes = 25, goal = DEFAULT_GOAL, kind = 'focus') {
  const durationMs = (kind === 'break' ? 5 : FOCUS_MINUTES.includes(minutes) ? minutes : 25) * 60000;
  return {
    version: 1, id: globalThis.crypto?.randomUUID?.() ?? `study-${Date.now()}-${Math.random()}`,
    kind, phase: 'idle', goal: String(goal).trim().slice(0, 200) || DEFAULT_GOAL,
    durationMs, remainingMs: durationMs, endsAt: null, startedAt: null, completedAt: null,
  };
}
export function remainingAt(timer, now) {
  return timer.phase === 'running'
    ? Math.max(0, Math.min(timer.remainingMs, timer.endsAt - now))
    : timer.remainingMs;
}
export function timerReducer(timer, action) {
  const now = action.now ?? Date.now();
  switch (action.type) {
    case 'RESTORE': return restoreTimer(action.timer, now);
    case 'NEW': return createTimer(action.minutes, action.goal);
    case 'START':
      if (!['idle', 'paused'].includes(timer.phase)) return timer;
      return { ...timer, phase: 'running', startedAt: timer.startedAt ?? now, endsAt: now + timer.remainingMs };
    case 'PAUSE':
      if (timer.phase !== 'running') return timer;
      if (remainingAt(timer, now) === 0) return timerReducer(timer, { type: 'TICK', now });
      return { ...timer, phase: 'paused', remainingMs: remainingAt(timer, now), endsAt: null };
    case 'TICK':
      if (timer.phase !== 'running' || remainingAt(timer, now) > 0) return timer;
      return { ...timer, phase: 'complete', remainingMs: 0, completedAt: timer.endsAt, endsAt: null };
    case 'FINISH':
      if (!['running', 'paused'].includes(timer.phase)) return timer;
      return { ...timer, phase: 'complete', remainingMs: remainingAt(timer, now), completedAt: now, endsAt: null };
    case 'BREAK':
      if (timer.phase !== 'complete' || timer.kind !== 'focus') return timer;
      return timerReducer(createTimer(5, 'Rest your eyes. Stretch. Get some water.', 'break'), { type: 'START', now });
    default: return timer;
  }
}
export function restoreTimer(value, now = Date.now()) {
  if (!value || value.version !== 1 || typeof value.id !== 'string' || !['idle', 'running', 'paused', 'complete'].includes(value.phase)
    || !['focus', 'break'].includes(value.kind) || typeof value.goal !== 'string'
    || !(value.kind === 'break' ? [300000] : FOCUS_MINUTES.map(m => m * 60000)).includes(value.durationMs)
    || !Number.isFinite(value.remainingMs) || value.remainingMs < 0 || value.remainingMs > value.durationMs
    || (value.phase !== 'idle' && !Number.isFinite(value.startedAt))
    || (value.phase === 'complete' && !Number.isFinite(value.completedAt))
    || (value.phase === 'running' && !Number.isFinite(value.endsAt))) return createTimer();
  const safe = { ...value, goal: value.goal.slice(0, 200) };
  // A clock adjustment must not extend the session beyond its saved remaining time.
  if (safe.phase === 'running') safe.endsAt = Math.min(safe.endsAt, now + safe.remainingMs);
  return timerReducer(safe, { type: 'TICK', now });
}
export function formatClock(ms) {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
export function formatStudyTime(ms) {
  return ms < 60000 ? 'Less than a minute' : `${Math.floor(ms / 60000)} min`;
}
export function recordSession(history, timer) {
  if (timer.kind !== 'focus' || timer.phase !== 'complete' || timer.startedAt === null || history.some(item => item.id === timer.id)) return history;
  return [{ id: timer.id, goal: timer.goal, spentMs: timer.durationMs - timer.remainingMs, completedAt: timer.completedAt, taskDone: false }, ...history].slice(0, 50);
}
export function readHistory(value) {
  return Array.isArray(value) ? value.filter(item => typeof item?.id === 'string' && typeof item.goal === 'string'
    && Number.isFinite(item.spentMs) && item.spentMs >= 0 && item.spentMs <= 45 * 60000 && Number.isFinite(item.completedAt))
    .slice(0, 50).map(item => ({ ...item, goal: item.goal.slice(0, 200), taskDone: item.taskDone === true })) : [];
}
