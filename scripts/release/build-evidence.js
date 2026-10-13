export function validateBuildEvidence(evidence, commits) {
  if (evidence?.schema !== 1 || evidence.validated !== true)
    return [
      "A validated release build is required; local builds are verification only",
    ];
  const errors = [];
  if (!["production", "staging"].includes(evidence.mode))
    errors.push("Unsupported release build mode");
  try {
    const url = new URL(evidence.apiOrigin);
    if (
      url.protocol !== "https:" ||
      url.origin !== evidence.apiOrigin ||
      url.username ||
      url.password ||
      /^(localhost|.*\.localhost|127\..*|0\.0\.0\.0|\[::1\])$/i.test(
        url.hostname.replace(/\.$/, ""),
      )
    )
      throw Error();
  } catch {
    errors.push("Release API origin must be HTTPS");
  }
  for (const key of ["frontend", "backend"])
    if (!commits[key] || evidence[key] !== commits[key])
      errors.push(`${key} build/source commit mismatch`);
  return errors;
}
