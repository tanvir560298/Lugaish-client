import test from "node:test";
import assert from "node:assert/strict";
import { waitForIdentity } from "./waitForIdentity.js";
test("redirect token-refresh failure rejects and removes auth listener instead of hanging login", async () => {
  let removed = 0;
  const error = Error("refresh failed");
  const pending = waitForIdentity((callback) => {
    queueMicrotask(() => callback({ getIdToken: () => Promise.reject(error) }));
    return () => removed++;
  }, 100);
  await assert.rejects(pending, (e) => e === error);
  assert.equal(removed, 1);
});
test("redirect recovery times out and handles immediate signed-out callback without leaking listener", async () => {
  let removed = 0;
  assert.equal(await waitForIdentity(() => () => removed++, 5), null);
  assert.equal(removed, 1);
  removed = 0;
  assert.equal(
    await waitForIdentity((callback) => {
      callback(null);
      return () => removed++;
    }),
    null,
  );
  assert.equal(removed, 1);
});
