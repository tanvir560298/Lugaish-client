// A catalog reset does not remove staff tools or invent a substitute course.
export function dashboardCourse(catalog, language) {
  const course = catalog?.[language];
  return course &&
    typeof course.title === "string" &&
    Array.isArray(course.modules)
    ? course
    : { title: "No published course", flag: "", modules: [] };
}
export function dashboardLessons(course) {
  return (Array.isArray(course?.modules) ? course.modules : []).flatMap(
    (module) => (Array.isArray(module?.lessons) ? module.lessons : []),
  );
}
