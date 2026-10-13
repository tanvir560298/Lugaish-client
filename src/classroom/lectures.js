import { activeLectureCourse, isLiveLectureLesson } from "./catalogPolicy.js";
import { accessibleVideos, resolveMedia } from "./mediaPolicy.js";
import { api } from "../api/client.js";
export const previewLectures = []; // Retired course media stays in the private archive.

export async function loadLectureDays(course) {
  const published = activeLectureCourse(await api.getCourses(), course);
  if (!published) return [];
  const plan = await api.getDayModules(course);
  return (plan.modules ?? []).filter(
    (m) =>
      m.publicationStatus === "published" &&
      m.published &&
      m.available &&
      !m.premiumLocked &&
      (m.videoCount > 0 || m.moduleType === "video"),
  );
}
export async function loadLectures(course, day, email, staff = false) {
  const published = activeLectureCourse(await api.getCourses(), course);
  if (!published) return [];
  const lesson = await api.getLesson(course, day); // Server validates entitlement again.

  if (!isLiveLectureLesson(lesson, published)) return [];
  let completed = new Set();
  try {
    const saved = JSON.parse(
      localStorage.getItem(
        `lugaish_lesson_video_progress_v1:${String(email || "learner")
          .trim()
          .toLowerCase()}:${course}:${day}`,
      ) || "[]",
    );
    if (Array.isArray(saved)) completed = new Set(saved.map(String));
  } catch {
    /* Fail closed for sequential videos. */
  }
  const records = accessibleVideos(lesson, completed, staff);
  if (!lesson.videos?.length && lesson.videoUrl)
    records.push({ ...lesson, _id: "legacy" });
  return records.flatMap((record, i) => {
    const media = resolveMedia(record);
    return media
      ? [
          {
            id: `${course}:${day}:${record._id || i}`,
            title: record.title || `Day ${day} lecture`,
            course,
            day,
            videoId: record._id,
            completed: Boolean(record.completed),
            tracksProgress:
              typeof record.completed === "boolean" ||
              typeof record.isLocked === "boolean",
            ...media,
          },
        ]
      : [];
  });
}

// Use the same explicit completion endpoint as LessonPage; watching alone never
// marks a lesson complete or awards a day reward.
export async function completeClassroomVideo(lecture) {
  if (!lecture?.tracksProgress || !lecture.videoId)
    throw new Error(
      "Open the normal lesson to record progress for this content.",
    );
  return api.completeLessonVideo(lecture.course, lecture.day, lecture.videoId);
}
