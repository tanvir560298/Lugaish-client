import test from "node:test";
import assert from "node:assert/strict";
import {
  dashboardCourse,
  dashboardLessons,
} from "../src/courses/dashboardPolicy.js";
import {
  serverLearningAccess,
  visibleEnrollments,
  shouldClearSession,
} from "../src/state/identityPolicy.js";
test("empty or malformed catalog keeps staff dashboard safe without inventing a course", () => {
  assert.equal(dashboardCourse({}, "english").title, "No published course");
  assert.deepEqual(dashboardLessons(undefined), []);
  assert.deepEqual(
    dashboardLessons({ modules: [null, { lessons: [{ id: "real" }] }] }),
    [{ id: "real" }],
  );
  const course = { title: "Published lesson", modules: [] };
  assert.equal(dashboardCourse({ arabic: course }, "arabic"), course);
});
test("server-removed enrollment and private access never fall back to cached client grants", () => {
  assert.deepEqual(
    serverLearningAccess({ enrolledPathways: [], privateBatchAccess: false }),
    {
      enrolledPathways: [],
      privateBatchAccess: false,
      privateBatchExplicitlyRevoked: false,
    },
  );
  assert.deepEqual(
    serverLearningAccess({
      enrolledPathways: ["english", "paid_batch"],
      privateBatchAccess: true,
      privateBatchExplicitlyRevoked: true,
    }).enrolledPathways,
    ["english"],
  );
  assert.deepEqual(visibleEnrollments([], "english", true), []);
  assert.equal(
    serverLearningAccess({
      enrolledPathways: ["paid_batch"],
      privateBatchAccess: false,
    }).privateBatchAccess,
    true,
  );
  assert.deepEqual(visibleEnrollments([], "english", false), ["english"]);
  assert.deepEqual(
    serverLearningAccess({
      enrolledPathways: ["arabic", "paid_batch"],
      privateBatchAccess: true,
    }).enrolledPathways,
    ["arabic", "paid_batch"],
  );
});

test("a stale unauthorized response cannot erase a newer authenticated session", () => {
  assert.equal(shouldClearSession("old-token", "new-token"), false);
  assert.equal(shouldClearSession("old-token", "old-token"), true);
  assert.equal(shouldClearSession(null, null), false);
});
