export function drivePreviewUrl(url) {
  try {
    const parsed = new URL(url);
    const match = parsed.pathname.match(/^\/file\/d\/([\w-]+)\//);
    return parsed.protocol === 'https:' && parsed.hostname === 'drive.google.com' && match
      ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
  } catch { return null; }
}

export function availableResources(resources, plan) {
  const started = plan.courseStarted ?? plan.courseSchedule?.courseStarted;
  if (started !== true) return [];
  const day = Number(plan.courseDay ?? plan.currentDay) || 0;
  return resources.filter(item => item.day <= day && !(plan.modules ?? []).some(module => module.day === item.day && (module.premiumLocked || module.published === false || module.available === false)));
}
