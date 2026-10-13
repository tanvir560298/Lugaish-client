import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("manual release preparation builds and verifies the selected environment without deploying", async () => {
  const workflow = await readFile(
    new URL("../../.github/workflows/prepare-release.yml", import.meta.url),
    "utf8",
  );
  assert.match(workflow, /staging\) npm run build:staging/);
  assert.match(workflow, /production\) npm run build:release/);
  assert.match(workflow, /\.env\.\$\{RELEASE_TARGET\}\.local/);
  assert.match(
    workflow,
    /verify-manifest\.mjs release-artifacts "\$RELEASE_TARGET" "\$API_ORIGIN"/,
  );
  assert.doesNotMatch(
    workflow,
    /\b(?:vercel|render|firebase|gcloud)\s+deploy\b|git\s+push\b/,
  );
});
