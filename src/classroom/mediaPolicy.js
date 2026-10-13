export function resolveMedia(record) {
  if (/^[\w-]{11}$/.test(record.youtubeId || '')) return { kind: 'youtube', youtubeId: record.youtubeId };
  const src = record.videoUrl;
  if (!src) return null;
  try {
    const url = new URL(src, 'https://lugaish.com');
    if (!['https:', 'http:'].includes(url.protocol)) return null;
    const id = url.hostname === 'youtu.be' ? url.pathname.slice(1) : /(^|\.)youtube\.com$/.test(url.hostname) ? (url.searchParams.get('v') || url.pathname.split('/embed/')[1]) : null;
    if (/^[\w-]{11}$/.test(id || '')) return { kind: 'youtube', youtubeId: id };
    if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) return { kind: 'file', src };
  } catch { /* Unsupported sources remain unavailable. */ }
  return null;
}
export function accessibleVideos(lesson, completedIds = new Set(), staff = false) {
  const videos = Array.isArray(lesson.videos) ? lesson.videos : [];
  const serverProgress = videos.some(v => typeof v.isLocked === 'boolean' || typeof v.completed === 'boolean' || typeof v.isNext === 'boolean');
  return videos.filter((video, index) => staff || (serverProgress ? video.isLocked === false : videos.slice(0,index).every((prior, i) => completedIds.has(String(prior._id ?? `${prior.youtubeId ?? 'video'}-${i}`)))));
}
