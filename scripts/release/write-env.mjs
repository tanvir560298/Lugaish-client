import { writeFile } from "node:fs/promises";
const file = process.argv[2];
if (!file) throw Error("Private output path required");
const keys = [
  "VITE_API_URL",
  "VITE_FIREBASE_API_KEY",
  "VITE_FIREBASE_AUTH_DOMAIN",
  "VITE_FIREBASE_PROJECT_ID",
  "VITE_FIREBASE_APP_ID",
  "VITE_TELEMETRY_ENABLED",
];
await writeFile(
  file,
  keys.map((k) => `${k}=${JSON.stringify(process.env[k] || "")}`).join("\n") +
    "\n",
  { mode: 0o600 },
);
