import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
test("failed release packaging invalidates a previous success manifest", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lugaish-artifact-guard-"));
  try {
    await mkdir(join(dir, "release-artifacts"));
    await writeFile(
      join(dir, "release-artifacts/release.json"),
      JSON.stringify({ deployable: true }),
    );
    // Missing backend prerequisites must fail without retaining the stale success flag.
    const result = spawnSync(
      process.execPath,
      [resolve("scripts/release/artifacts.mjs")],
      { cwd: dir, encoding: "utf8" },
    );
    assert.notEqual(result.status, 0);
    await assert.rejects(access(join(dir, "release-artifacts/release.json")));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
