// Continue animation at full cadence while people move. Quiet scenes keep
// subtle idle poses, and hidden documents do not wake a polling timer.
export function sceneFrameRate(room, now, { low = false, reducedMotion = false } = {}) {
  if (reducedMotion || !room?.members?.length) return 0;
  const active = room.members.some(person => person.motion?.endsAt > now || person.greeting?.until > now);
  return active ? (low ? 30 : 60) : (low ? 15 : 30);
}

export function scheduleSceneFrames({ room, getNow, invalidate, low, reducedMotion,
  document: doc = globalThis.document, setTimeout: later = globalThis.setTimeout, clearTimeout: cancel = globalThis.clearTimeout }) {
  let timer = null, disposed = false;
  const clear = () => { if (timer !== null) cancel(timer); timer = null; };
  const schedule = () => {
    clear();
    if (disposed || doc.hidden) return;
    const fps = sceneFrameRate(room, getNow(), { low, reducedMotion });
    if (!fps) return;
    timer = later(() => { timer = null; if (!disposed && !doc.hidden) invalidate(); schedule(); }, 1000 / fps);
  };
  const visibility = () => { clear(); if (!doc.hidden && !disposed) { invalidate(); schedule(); } };
  doc.addEventListener('visibilitychange', visibility);
  schedule();
  return () => { disposed = true; clear(); doc.removeEventListener('visibilitychange', visibility); };
}
