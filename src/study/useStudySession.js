import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import { createStudySaver } from './saveState.js';
import { recordSession, readHistory, remainingAt, restoreTimer, timerReducer } from './timer.js';
function read(key) {
  try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch { return null; }
}
export function useStudySession(scope) {
  const key = `lugaish-study-v1:${scope}`;
  const [timer, dispatch] = useReducer(timerReducer, null, () => restoreTimer(read(`${key}:timer`)));
  const [history, setHistory] = useState(() => readHistory(read(`${key}:history`)));
  const [notes, setNotes] = useState(() => {
    const saved = read(`${key}:notes`);
    return typeof saved === 'string' ? saved.slice(0, 20000) : '';
  });
  const [storageError, setStorageError] = useState('');
  const [now, setNow] = useState(Date.now);
  const saver = useMemo(() => createStudySaver({ write: (suffix, value) => localStorage.setItem(`${key}:${suffix}`, value), onError: setStorageError }), [key]);
  const save = saver.save;
  const retrySaving = useCallback(() => saver.retry({ timer, history, notes }), [saver, timer, history, notes]);
  useEffect(() => { save('timer', timer); }, [timer, save]);
  useEffect(() => {
    const sync = event => {
      if (event.key === `${key}:timer` && event.newValue) {
        try { dispatch({ type: 'RESTORE', timer: JSON.parse(event.newValue) }); } catch { /* Ignore malformed browser storage. */ }
      }
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, [key]);
  useEffect(() => { save('history', history); }, [history, save]);
  // Notes are small and saved immediately so navigating away cannot lose the last edit.
  useEffect(() => { save('notes', notes); }, [notes, save]);
  useEffect(() => {
    const tick = () => { const current = Date.now(); setNow(current); dispatch({ type: 'TICK', now: current }); };
    tick();
    const interval = window.setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, []);
  useEffect(() => { setHistory(current => recordSession(current, timer)); }, [timer]);
  const markDone = () => setHistory(current => recordSession(current, timer).map(item => item.id === timer.id ? { ...item, taskDone: true } : item));
  return { timer, dispatch, history, notes, setNotes, storageError, retrySaving, remaining: remainingAt(timer, now), markDone };
}
