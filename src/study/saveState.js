export const STUDY_STORAGE_WARNING = 'Your work is still available in this visit, but browser saving failed. It may be lost when you leave or refresh. Retry saving or download your notes.';

export function createStudySaver({ write, onError }) {
  const failed = new Set();
  const save = (suffix, value) => {
    let success = true;
    try { write(suffix, JSON.stringify(value)); failed.delete(suffix); }
    catch { failed.add(suffix); success = false; }
    onError(failed.size ? STUDY_STORAGE_WARNING : '');
    return success;
  };
  return { save, retry(snapshot) { return Object.entries(snapshot).map(([suffix, value]) => save(suffix, value)).every(Boolean); } };
}
