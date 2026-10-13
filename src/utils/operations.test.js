import test from "node:test";
import assert from "node:assert/strict";
import { createOperationalReporter } from "./operations.js";
test("reporter is opt-in, bounded and sends no personal error content", () => {
  const messages = [];
  let now = 1;
  const report = createOperationalReporter({
    enabled: true,
    send: (m) => messages.push(m),
    now: () => now,
  });
  report("secret@example.test");
  for (let n = 0; n < 20; n++) report("api_failure");
  assert.equal(messages.length, 10);
  assert.deepEqual(messages[0], { event: "api_failure" });
  now = 60001;
  report("auth_failure");
  assert.equal(messages.length, 11);
  createOperationalReporter({ send: (m) => messages.push(m) })("api_failure");
  assert.equal(messages.length, 11);
});
