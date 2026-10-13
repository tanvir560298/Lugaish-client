/** Local-only commands. A network implementation MUST validate identity, role,
 * lecture entitlement and transitions on the server; these are NOT permissions. */
export const TRANSITIONS = {
  Loading: { LOADED: 'Waiting', END: 'Ended', FAIL: 'Error' },
  Waiting: { STUDY_READY: 'LecturePaused', START: 'TeacherEntering', END: 'Ended', FAIL: 'Error' },
  TeacherEntering: { ENTERED: 'TeacherApproaching', END: 'Ended', FAIL: 'Error' },
  TeacherApproaching: { ARRIVED: 'PreparingLecture', END: 'Ended', FAIL: 'Error' },
  PreparingLecture: { PREPARED: 'LectureReady', END: 'Ended', FAIL: 'Error' },
  LectureReady: { PLAYING: 'LecturePlaying', END: 'Ended', FAIL: 'Error' },
  LecturePlaying: { PAUSED: 'LecturePaused', FINISHED: 'Ended', END: 'Ended', FAIL: 'Error' },
  LecturePaused: { PLAYING: 'LecturePlaying', FINISHED: 'Ended', END: 'Ended', FAIL: 'Error' },
  Ended: { STUDY_READY: 'LecturePaused', RESET: 'Waiting' }, Error: { RESET: 'Waiting', END: 'Ended' },
};
export function transition(state, event) { return TRANSITIONS[state]?.[event] ?? state; }
export const CLASS_ACTIVE = new Set(['TeacherEntering', 'TeacherApproaching', 'PreparingLecture', 'LectureReady', 'LecturePlaying', 'LecturePaused']);
export function createLocalSession() {
  const listeners = new Set();
  const id = globalThis.crypto?.randomUUID?.() ?? `local-${Date.now()}`;
  let sequence = 0;
  return {
    id,
    emit(type, payload = {}) {
      const event = { version: 1, sessionId: id, entityId: 'local-student', sequence: ++sequence, timestamp: Date.now(), type, payload };
      listeners.forEach(listener => listener(event));
      return event;
    },
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
    dispose() { listeners.clear(); },
  };
}
/** Remote snapshots never use local input. Blend between received snapshots. */
export function interpolateSnapshot(a, b, time) {
  const t = Math.max(0, Math.min(1, (time-a.timestamp)/Math.max(1,b.timestamp-a.timestamp)));
  const delta = Math.atan2(Math.sin(b.yaw-a.yaw), Math.cos(b.yaw-a.yaw));
  return { x:a.x+(b.x-a.x)*t, z:a.z+(b.z-a.z)*t, yaw:a.yaw+delta*t, animation:b.animation };
}
