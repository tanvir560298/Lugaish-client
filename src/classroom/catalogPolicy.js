export function activeLectureCourse(catalog, language) {
  return Array.isArray(catalog)
    ? catalog.find(
        (c) =>
          c.language === language &&
          c.status === "published" &&
          typeof c.generation === "string" &&
          c.generation.length > 0,
      ) || null
    : null;
}
export function isLiveLectureLesson(lesson, course) {
  return Boolean(
    course &&
      lesson?.publicationStatus === "published" &&
      lesson.courseGeneration === course.generation,
  );
}
