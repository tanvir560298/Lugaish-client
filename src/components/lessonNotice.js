export function availableLessonNotice(response) {
  if (response?.courseStarted !== true || !Array.isArray(response.modules))
    return null;
  const item = response.modules.find(
    (m) =>
      Number.isInteger(m.day) &&
      m.day > 0 &&
      m.day === response.courseDay &&
      m.publicationStatus === "published" &&
      m.published === true &&
      m.available === true &&
      m.premiumLocked !== true,
  );
  return item
    ? { day: item.day, title: item.title || `Day ${item.day}` }
    : null;
}
