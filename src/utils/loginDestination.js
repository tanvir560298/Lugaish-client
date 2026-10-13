export function loginDestination(location, savedContext = {}) {
  const candidate = savedContext.returnTo || (location?.state?.from?.pathname
    ? `${location.state.from.pathname}${location.state.from.search || ''}${location.state.from.hash || ''}` : '');
  if (typeof candidate !== 'string' || !candidate.startsWith('/') || candidate.startsWith('//') || candidate.includes('\\') || /[\u0000-\u0020]/.test(candidate)) return '/daily-lessons';
  if (/^\/(login|signup|auth)([/?#]|$)/.test(candidate)) return '/daily-lessons';
  return candidate;
}

export function loginReturnState(location, savedContext = {}) {
  const source = savedContext.returnState ?? location?.state?.from?.state;
  if (!source || typeof source !== 'object') return undefined;
  const state = {};
  if (['english', 'arabic', 'paid_batch'].includes(source.learningCourse)) state.learningCourse = source.learningCourse;
  if (Number.isInteger(source.learningDay) && source.learningDay > 0) state.learningDay = source.learningDay;
  return Object.keys(state).length ? state : undefined;
}
