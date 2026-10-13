export function validateReleaseEnvironment(kind, e) {
  const errors = [];
  const required =
    kind === "frontend"
      ? [
          "VITE_API_URL",
          "VITE_FIREBASE_API_KEY",
          "VITE_FIREBASE_AUTH_DOMAIN",
          "VITE_FIREBASE_PROJECT_ID",
          "VITE_FIREBASE_APP_ID",
        ]
      : kind === "backend"
        ? [
            "NODE_ENV",
            "APP_ENV",
            "MONGODB_URI",
            "JWT_SECRET",
            "FIREBASE_PROJECT_ID",
            "FRONTEND_URL",
            "CORS_ORIGIN",
          ]
        : [];
  if (!required.length) return ["Unknown environment kind"];
  for (const k of required)
    if (!e[k] || /replace|your-|example\.(invalid|com)|REPLACE/i.test(e[k]))
      errors.push(`${k}: missing or placeholder`);
  for (const k of kind === "frontend"
    ? ["VITE_API_URL"]
    : ["FRONTEND_URL", "CORS_ORIGIN"])
    for (const value of (e[k] || "").split(",")) {
      try {
        const u = new URL(value);
        if (
          u.protocol !== "https:" ||
          u.username ||
          u.password ||
          u.search ||
          u.hash ||
          /^(localhost|.*\.localhost|127\..*|0\.0\.0\.0|\[::1\])$/i.test(
            u.hostname.replace(/\.$/, ""),
          ) ||
          (k !== "VITE_API_URL" && u.origin !== value)
        )
          throw Error();
      } catch {
        errors.push(
          `${k}: HTTPS URL required (CORS/frontend must be exact origins)`,
        );
      }
    }
  if (kind === "frontend") {
    const domain = e.VITE_FIREBASE_AUTH_DOMAIN || "";
    if (
      !/^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
        domain,
      ) ||
      /(^|\.)localhost$/i.test(domain)
    )
      errors.push(
        "VITE_FIREBASE_AUTH_DOMAIN: hostname only, without scheme, path or port",
      );
    if (!/^[a-z][a-z0-9-]{4,29}$/.test(e.VITE_FIREBASE_PROJECT_ID || ""))
      errors.push("VITE_FIREBASE_PROJECT_ID: invalid project identifier");
  }
  if (kind === "backend") {
    if (e.NODE_ENV !== "production") errors.push("NODE_ENV must be production");
    if (!["staging", "production"].includes(e.APP_ENV))
      errors.push("APP_ENV must be staging or production");
    if ((e.JWT_SECRET || "").length < 32)
      errors.push("JWT_SECRET must be at least 32 characters");
    try {
      const u = new URL(e.MONGODB_URI);
      if (
        !["mongodb:", "mongodb+srv:"].includes(u.protocol) ||
        !u.username ||
        !u.password ||
        u.hash ||
        /^(localhost|.*\.localhost|127\..*|0\.0\.0\.0|\[::1\])$/i.test(
          u.hostname.replace(/\.$/, ""),
        ) ||
        !u.pathname.slice(1)
      )
        throw Error();
      const stagingDatabase = /(?:^|[_-])staging(?:$|[_-])/i.test(
        u.pathname.slice(1),
      );
      if (e.APP_ENV === "staging" && !stagingDatabase)
        errors.push("Staging requires a staging-named database");
      if (e.APP_ENV === "production" && stagingDatabase)
        errors.push("Production must not use a staging database");
    } catch {
      errors.push("MongoDB must have credentials and an explicit database");
    }
  }
  for (const k of Object.keys(e))
    if (k.startsWith("VITE_") && /SECRET|PRIVATE|PASSWORD|ADMIN|TOKEN/.test(k))
      errors.push(`${k}: secrets cannot be shipped to a browser`);
  return [...new Set(errors)];
}
