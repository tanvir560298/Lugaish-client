import { validateReleaseEnvironment } from "./validate-env.js";
export function validateEnvironmentPair(frontend, backend) {
  const errors = [
    ...validateReleaseEnvironment("frontend", frontend),
    ...validateReleaseEnvironment("backend", backend),
  ];
  if (frontend.VITE_FIREBASE_PROJECT_ID !== backend.FIREBASE_PROJECT_ID)
    errors.push("Frontend/backend Firebase project mismatch");
  try {
    const api = new URL(frontend.VITE_API_URL),
      publicApi = new URL(backend.PUBLIC_API_ORIGIN),
      site = new URL(backend.FRONTEND_URL);
    if (
      publicApi.protocol !== "https:" ||
      publicApi.origin !== backend.PUBLIC_API_ORIGIN ||
      api.origin !== publicApi.origin
    )
      errors.push("Frontend API and approved backend public origin mismatch");
    if (!(backend.CORS_ORIGIN || "").split(",").includes(site.origin))
      errors.push("Frontend origin missing from API CORS allowlist");
    const domains = [
      site.hostname,
      `${frontend.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
    ];
    if (!domains.includes(frontend.VITE_FIREBASE_AUTH_DOMAIN))
      errors.push(
        "Auth domain does not match the frontend or chosen Firebase project",
      );
  } catch {
    errors.push(
      "Approved public API/frontend origins required for paired validation",
    );
  }
  return [...new Set(errors)];
}
