import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { assertCleanReleaseSources } from "./clean-source.js";

const revisions = { frontend: "a".repeat(40), backend: "b".repeat(40) };
const frontendDirectory = resolve(".");
function fixture({
  status = () => "",
  pointer = revisions.backend,
  revision = revisions,
  fail = () => false,
} = {}) {
  return (args, cwd) => {
    const repository = cwd === frontendDirectory ? "frontend" : "backend";
    if (fail(args, repository)) throw Error("PRIVATE_GIT_ERROR");
    if (args[0] === "status") return status(repository);
    if (args[0] === "rev-parse") return revision[repository];
    if (args[0] === "ls-tree")
      return pointer ? `160000 commit ${pointer}\tserver\n` : "";
    throw Error("Unexpected Git command");
  };
}

test("release source guard returns matching committed clean frontend/backend revisions", () => {
  assert.deepEqual(assertCleanReleaseSources({ runGit: fixture() }), revisions);
});

test("release source guard refuses modified, staged and untracked changes without revealing paths", () => {
  for (const repository of ["frontend", "backend"])
    for (const marker of [" M", "M ", "??"])
      assert.throws(
        () =>
          assertCleanReleaseSources({
            runGit: fixture({
              status: (current) =>
                current === repository ? `${marker} PRIVATE_SOURCE_PATH\n` : "",
            }),
          }),
        (error) =>
          /committed clean/.test(error.message) &&
          !error.message.includes("PRIVATE_SOURCE_PATH"),
      );
});

test("release source guard requires the actual backend HEAD to match the committed gitlink", () => {
  for (const pointer of ["c".repeat(40), null])
    assert.throws(
      () => assertCleanReleaseSources({ runGit: fixture({ pointer }) }),
      /committed gitlink/,
    );
});

test("release source guard fails closed on unavailable or invalid Git metadata", () => {
  for (const command of ["status", "rev-parse", "ls-tree"])
    assert.throws(
      () =>
        assertCleanReleaseSources({
          runGit: fixture({ fail: (args) => args[0] === command }),
        }),
      (error) => error.message === "Release source metadata unavailable",
    );
  assert.throws(
    () =>
      assertCleanReleaseSources({
        runGit: fixture({
          revision: { ...revisions, backend: "not-a-commit" },
        }),
      }),
    /revision unavailable/,
  );
});

test("release source guard rechecks cleanliness after collecting revisions", () => {
  let frontendChecks = 0;
  assert.throws(
    () =>
      assertCleanReleaseSources({
        runGit: fixture({
          status: (repository) =>
            repository === "frontend" && ++frontendChecks > 1
              ? "?? PRIVATE_LATE_CHANGE\n"
              : "",
        }),
      }),
    /committed clean/,
  );
});
