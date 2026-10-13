import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { verifyManifest } from "./verify-manifest.js";
const files = Object.fromEntries(
  ["frontend.tar.gz", "api.tar.gz", "api.Dockerfile"].map((n) => [
    n,
    Buffer.from(n),
  ]),
);
const manifest = {
  deployable: true,
  frontend: "front",
  backend: "back",
  build: {
    schema: 1,
    validated: true,
    mode: "staging",
    apiOrigin: "https://api.lugaish.test",
    frontend: "front",
    backend: "back",
  },
  sha256: Object.fromEntries(
    Object.entries(files).map(([n, b]) => [
      n,
      createHash("sha256").update(b).digest("hex"),
    ]),
  ),
};
const target = { mode: "staging", apiOrigin: "https://api.lugaish.test" };
test("rollback integrity rehearsal accepts intact candidate and rejects corruption, missing bytes and review snapshots", () => {
  assert.deepEqual(verifyManifest(manifest, files, target), []);
  assert.ok(
    verifyManifest(
      manifest,
      { ...files, "api.tar.gz": Buffer.from("corrupted") },
      target,
    ).length,
  );
  assert.ok(verifyManifest(manifest, {}, target).length);
  assert.ok(
    verifyManifest({ ...manifest, deployable: false }, files, target).length,
  );
});
test("rollback candidate must match environment, API origin and source revisions", () => {
  assert.ok(
    verifyManifest(manifest, files, { ...target, mode: "production" }).length,
  );
  assert.ok(
    verifyManifest(manifest, files, {
      ...target,
      apiOrigin: "https://other.lugaish.test",
    }).length,
  );
  assert.ok(
    verifyManifest({ ...manifest, backend: "other" }, files, target).length,
  );
});
