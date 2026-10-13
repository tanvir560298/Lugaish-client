import test from "node:test";
import assert from "node:assert/strict";
import { activeLectureCourse, isLiveLectureLesson } from "./catalogPolicy.js";
test("classroom cannot reuse archived staff authoring lessons as active lectures", () => {
  assert.equal(activeLectureCourse([], "english"), null);
  const course = activeLectureCourse(
    [{ language: "english", status: "published", generation: "fresh" }],
    "english",
  );
  assert.ok(course);
  for (const lesson of [
    { publicationStatus: "archived", courseGeneration: "fresh" },
    { publicationStatus: "draft", courseGeneration: "fresh" },
    { publicationStatus: "published", courseGeneration: "old" },
  ])
    assert.equal(isLiveLectureLesson(lesson, course), false);
  assert.equal(
    isLiveLectureLesson(
      { publicationStatus: "published", courseGeneration: "fresh" },
      course,
    ),
    true,
  );
});
