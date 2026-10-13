import { validateBuildEvidence } from "./build-evidence.js";
import { createHash } from "node:crypto";
import {
  mkdir,
  writeFile,
  access,
  cp,
  readFile,
  rm,
  rename,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
const run = (args, cwd) => {
  const r = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (r.status) throw Error("Git release metadata unavailable");
  return r.stdout.trim();
};
await rm("release-artifacts/release.json", { force: true });
for (const file of [
  "server/src/utils/operations.js",
  "server/src/models/Course.js",
  "server/src/middleware/coursePublication.js",
])
  await access(file);
const allowDirty = process.argv.includes("--allow-dirty-local");
for (const dir of [".", "server"])
  if (!allowDirty && run(["status", "--porcelain"], dir))
    throw Error(
      "Release requires committed clean frontend and backend; never package an unreviewed working tree",
    );
await mkdir("release-artifacts", { recursive: true });
const metadata = {
  frontend: run(["rev-parse", "HEAD"], "."),
  backend: run(["rev-parse", "HEAD"], "server"),
  deployable: !allowDirty,
  createdAt: new Date().toISOString(),
};
// Invalidate any previous success manifest before attempting to replace archives.
if (!allowDirty) {
  let evidence;
  try {
    evidence = JSON.parse(await readFile("dist/release-build.json", "utf8"));
  } catch {
    throw Error(
      "Validated release build receipt missing; run build:release or build:staging",
    );
  }
  const errors = validateBuildEvidence(evidence, metadata);
  if (errors.length) throw Error(errors.join("; "));
  metadata.build = evidence;
}
for (const args of [
  ["-czf", "release-artifacts/frontend.tar.gz", "-C", "dist", "."],
  [
    "-czf",
    "release-artifacts/api.tar.gz",
    "-C",
    "server",
    "package.json",
    "package-lock.json",
    "src",
    "study",
    "scripts/prepare-indexes.mjs",
    "scripts/course-reset.mjs",
  ],
]) {
  const r = spawnSync("tar", args, { stdio: "inherit" });
  if (r.status) throw Error("Artifact export failed");
}
console.log(
  "Sanitized artifacts created; no .env, archives, database exports or dependency folders included.",
);

await cp("deploy/api.Dockerfile", "release-artifacts/api.Dockerfile");
metadata.sha256 = {};
for (const file of ["frontend.tar.gz", "api.tar.gz", "api.Dockerfile"])
  metadata.sha256[file] = createHash("sha256")
    .update(await readFile("release-artifacts/" + file))
    .digest("hex");
await writeFile(
  "release-artifacts/release.json.tmp",
  JSON.stringify(metadata, null, 2),
);

await rename(
  "release-artifacts/release.json.tmp",
  "release-artifacts/release.json",
);
