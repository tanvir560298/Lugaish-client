import test from "node:test";
import assert from "node:assert/strict";
import { validateReleaseEnvironment as validate } from "./validate-env.js";
const backend = {
  NODE_ENV: "production",
  APP_ENV: "staging",
  MONGODB_URI: "mongodb+srv://user:password@cluster.invalid/lugaish_staging",
  JWT_SECRET: "a".repeat(40),
  FIREBASE_PROJECT_ID: "test-project",
  FRONTEND_URL: "https://staging.test.invalid",
  CORS_ORIGIN: "https://staging.test.invalid",
};
test("release validation blocks shared staging database and exposed secrets", () => {
  assert.deepEqual(validate("backend", backend), []);
  assert.ok(
    validate("backend", {
      ...backend,
      MONGODB_URI: "mongodb+srv://user:password@cluster.invalid/lugaish",
    }).length,
  );
  assert.ok(
    validate("backend", { ...backend, VITE_PRIVATE_KEY: "secret" }).length,
  );
});
test("release database validation allows legitimate driver options but prevents environment confusion", () => {
  assert.deepEqual(
    validate("backend", {
      ...backend,
      MONGODB_URI: backend.MONGODB_URI + "?retryWrites=true&w=majority",
    }),
    [],
  );
  assert.ok(validate("backend", { ...backend, APP_ENV: "production" }).length);
  assert.ok(
    validate("backend", {
      ...backend,
      MONGODB_URI: "mongodb+srv://user:password@cluster.invalid/notstaging",
    }).length,
  );
});
test("release validation rejects cross-origin placeholders and CORS paths", () => {
  assert.ok(
    validate("backend", {
      ...backend,
      CORS_ORIGIN: "https://staging.test.invalid/path",
    }).length,
  );
  assert.ok(validate("frontend", {}).length);
});
test("HTTPS loopback and API query/hash cannot masquerade as public release URLs", () => {
  const frontend = {
    VITE_API_URL: "https://api.lugaish.test/api",
    VITE_FIREBASE_API_KEY: "public-key",
    VITE_FIREBASE_AUTH_DOMAIN: "lugaish.test",
    VITE_FIREBASE_PROJECT_ID: "lugaish-test",
    VITE_FIREBASE_APP_ID: "public-app",
  };
  assert.deepEqual(validate("frontend", frontend), []);
  for (const url of [
    "https://localhost/api",
    "https://127.0.0.1/api",
    "https://[::1]/api",
    "https://preview.localhost/api",
    "https://api.lugaish.test/api?token=abc",
    "https://api.lugaish.test/api#fragment",
  ])
    assert.ok(
      validate("frontend", { ...frontend, VITE_API_URL: url }).length,
      url,
    );
});
test("release auth domain rejects scheme/path/port and malformed Firebase project identifiers", () => {
  const frontend = {
    VITE_API_URL: "https://api.lugaish.test/api",
    VITE_FIREBASE_API_KEY: "public-key",
    VITE_FIREBASE_AUTH_DOMAIN: "lugaish.test",
    VITE_FIREBASE_PROJECT_ID: "lugaish-test",
    VITE_FIREBASE_APP_ID: "public-app",
  };
  for (const domain of [
    "https://lugaish.test",
    "lugaish.test/auth",
    "localhost",
    "lugaish.test:443",
  ])
    assert.ok(
      validate("frontend", { ...frontend, VITE_FIREBASE_AUTH_DOMAIN: domain })
        .length,
    );
  assert.ok(
    validate("frontend", {
      ...frontend,
      VITE_FIREBASE_PROJECT_ID: "bad project",
    }).length,
  );
  assert.ok(
    validate("frontend", {
      ...frontend,
      VITE_API_URL: "https://localhost./api",
    }).length,
  );
});
