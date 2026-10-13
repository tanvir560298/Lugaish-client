import test from "node:test";
import assert from "node:assert/strict";
import { validateEnvironmentPair } from "./validate-pair.js";
const front = {
  VITE_API_URL: "https://api.lugaish.test/api",
  VITE_FIREBASE_API_KEY: "public-key",
  VITE_FIREBASE_AUTH_DOMAIN: "staging.lugaish.test",
  VITE_FIREBASE_PROJECT_ID: "lugaish-staging",
  VITE_FIREBASE_APP_ID: "public-app",
};
const back = {
  NODE_ENV: "production",
  APP_ENV: "staging",
  MONGODB_URI: "mongodb+srv://user:password@cluster.invalid/lugaish_staging",
  JWT_SECRET: "a".repeat(40),
  FIREBASE_PROJECT_ID: "lugaish-staging",
  FRONTEND_URL: "https://staging.lugaish.test",
  CORS_ORIGIN: "https://staging.lugaish.test",
  PUBLIC_API_ORIGIN: "https://api.lugaish.test",
};
test("paired staging validation accepts matching public origins and Firebase project", () =>
  assert.deepEqual(validateEnvironmentPair(front, back), []));
test("paired configuration rejects project, CORS, API and auth-domain mismatch", () => {
  for (const patch of [
    { FIREBASE_PROJECT_ID: "other-project" },
    { CORS_ORIGIN: "https://other.lugaish.test" },
    { PUBLIC_API_ORIGIN: "https://wrong.lugaish.test" },
  ])
    assert.ok(validateEnvironmentPair(front, { ...back, ...patch }).length);
  assert.ok(
    validateEnvironmentPair(
      { ...front, VITE_FIREBASE_AUTH_DOMAIN: "other.firebaseapp.com" },
      back,
    ).length,
  );
});
