import test from "node:test";
import assert from "node:assert/strict";
import { verifiedGoalStatus } from "../src/learning/goalProgress.js";
test("selected intentions only become achieved from relevant verified daily events", () => {
  assert.equal(verifiedGoalStatus("Complete one available lesson", null), null);
  assert.equal(
    verifiedGoalStatus("Complete one available lesson", {
      lessons: 0,
      practice: 1,
      reviews: 1,
    }),
    null,
  );
  assert.ok(
    verifiedGoalStatus("Complete one available lesson", { lessons: 1 }),
  );
  assert.ok(
    verifiedGoalStatus("Finish an eligible practice activity", { practice: 1 }),
  );
  assert.ok(verifiedGoalStatus("Review mistakes", { reviews: 1 }));
  assert.equal(
    verifiedGoalStatus("Study for 15 minutes", {
      lessons: 3,
      practice: 2,
      reviews: 1,
    }),
    null,
  );
});
