export const DAILY_TARGETS = [30, 60, 90, 120];
export function calendarDay(value = Date.now()) {
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function cleanWorkspace(value) {
  const source = value && typeof value === 'object' ? value : {};
  const ids = new Set();
  return {
    target: DAILY_TARGETS.includes(source.target) ? source.target : 60,
    tasks: (Array.isArray(source.tasks) ? source.tasks : []).filter(task => {
      if (!task || typeof task.id !== 'string' || !task.id || task.id.length > 100 || ids.has(task.id) || typeof task.text !== 'string' || !task.text.trim()) return false;
      ids.add(task.id); return true;
    }).slice(0, 12).map(task => ({ id: task.id, text: task.text.trim().slice(0, 200), done: task.done === true })),
    watched: [...new Set((Array.isArray(source.watched) ? source.watched : []).filter(id => /^(0[1-7])$/.test(id)))],
  };
}
export function studySummary(history, now = Date.now()) {
  const seen = new Set();
  const sessions = (Array.isArray(history) ? history : []).filter(item => {
    if (!item || typeof item.id !== 'string' || seen.has(item.id) || !Number.isFinite(item.spentMs) || item.spentMs <= 0 || item.spentMs > 45 * 60000 || !Number.isFinite(item.completedAt) || item.completedAt > now) return false;
    seen.add(item.id); return true;
  });
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(now); date.setDate(date.getDate() - 6 + index);
    const key = calendarDay(date);
    const records = sessions.filter(item => calendarDay(item.completedAt) === key);
    return { key, label: new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date), spentMs: records.reduce((sum, item) => sum + item.spentMs, 0), count: records.length };
  });
  return { days, today: days[6], sessionCount: sessions.length, totalMs: sessions.reduce((sum, item) => sum + item.spentMs, 0) };
}
export function youtubeId(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    let id;
    if (['youtu.be', 'www.youtu.be'].includes(host)) id = url.pathname.split('/')[1];
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtube-nocookie.com', 'www.youtube-nocookie.com'].includes(host)) {
      const segments = url.pathname.split('/').filter(Boolean);
      id = segments[0] === 'watch' ? url.searchParams.get('v') : ['embed', 'shorts', 'live'].includes(segments[0]) ? segments[1] : null;
    }
    return typeof id === 'string' && /^[\w-]{11}$/.test(id) ? id : null;
  } catch { return null; }
}
