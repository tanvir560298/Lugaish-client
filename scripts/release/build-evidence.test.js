import test from "node:test";
import assert from "node:assert/strict";
import { validateBuildEvidence } from "./build-evidence.js";
const commits = { frontend: "front-sha", backend: "api-sha" };
const valid = {
  schema: 1,
  validated: true,
  mode: "production",
  apiOrigin: "https://api.lugaish.test",
  ...commits,
};
test("release packaging rejects ordinary builds and mismatched source commits", () => {
  assert.ok(validateBuildEvidence(null, commits).length);
  assert.ok(
    validateBuildEvidence({ ...valid, frontend: "old-sha" }, commits).length,
  );
  assert.ok(
    validateBuildEvidence({ ...valid, backend: "old-api" }, commits).length,
  );
  assert.ok(
    validateBuildEvidence({ ...valid, validated: false }, commits).length,
  );
});
test("release receipt permits matching HTTPS staging/production and rejects local origins", () => {
  assert.deepEqual(validateBuildEvidence(valid, commits), []);
  assert.deepEqual(
    validateBuildEvidence({ ...valid, mode: "staging" }, commits),
    [],
  );
  assert.ok(
    validateBuildEvidence(
      { ...valid, apiOrigin: "http://127.0.0.1:5001" },
      commits,
    ).length,
  );
  assert.ok(
    validateBuildEvidence({ ...valid, mode: "development" }, commits).length,
  );
});

test("rollback build evidence rejects HTTPS loopback origins too", () => {
  assert.ok(
    validateBuildEvidence({ ...valid, apiOrigin: "https://localhost" }, commits)
      .length,
  );
});
