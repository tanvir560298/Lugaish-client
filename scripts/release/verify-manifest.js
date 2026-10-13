import { createHash } from "node:crypto";
import { validateBuildEvidence } from "./build-evidence.js";
export function verifyManifest(manifest, files, target) {
  const errors = [];
  if (manifest?.deployable !== true)
    errors.push(
      "Review-only or incomplete artifact is not a rollback candidate",
    );
  errors.push(...validateBuildEvidence(manifest?.build, manifest || {}));
  if (
    !["staging", "production"].includes(target?.mode) ||
    manifest?.build?.mode !== target.mode
  )
    errors.push("Release/target environment mismatch");
  if (!target?.apiOrigin || manifest?.build?.apiOrigin !== target.apiOrigin)
    errors.push("Release/target API origin mismatch");
  for (const name of ["frontend.tar.gz", "api.tar.gz", "api.Dockerfile"]) {
    const expected = manifest?.sha256?.[name];
    if (
      !/^[a-f0-9]{64}$/.test(expected || "") ||
      !files[name] ||
      createHash("sha256").update(files[name]).digest("hex") !== expected
    )
      errors.push(`Missing or corrupted ${name}`);
  }
  return errors;
}
