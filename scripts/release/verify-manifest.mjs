import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { verifyManifest } from "./verify-manifest.js";
const [dir, mode, apiOrigin] = process.argv.slice(2);
if (!dir || !mode || !apiOrigin)
  throw Error(
    "Usage: verify-manifest.mjs ARTIFACT_DIR staging|production EXPECTED_HTTPS_API_ORIGIN",
  );
const manifest = JSON.parse(await readFile(join(dir, "release.json"), "utf8"));
const files = {};
for (const name of ["frontend.tar.gz", "api.tar.gz", "api.Dockerfile"])
  files[name] = await readFile(join(dir, name));
const errors = verifyManifest(manifest, files, { mode, apiOrigin });
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "Artifact hashes, source IDs and target compatibility verified. This does not authorize deployment or prove migration compatibility.",
);
