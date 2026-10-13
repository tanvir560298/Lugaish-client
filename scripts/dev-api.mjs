import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Run the tracked backend with the same Firebase project and port as the UI.
const root = new URL('../', import.meta.url);
for (const path of ['server/.env', '.env']) {
  const file = fileURLToPath(new URL(path, root));
  if (existsSync(file)) process.loadEnvFile(file);
}

const apiUrl = new URL(process.env.VITE_API_URL || 'http://localhost:5000/api');
if (!['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname)) {
  throw new Error('dev:api is for a local API. Set VITE_API_URL to a localhost URL first.');
}
process.env.PORT ||= apiUrl.port || '5000';
process.env.FIREBASE_PROJECT_ID ||= process.env.VITE_FIREBASE_PROJECT_ID || '';
if (!process.env.FIREBASE_PROJECT_ID) {
  throw new Error('Set VITE_FIREBASE_PROJECT_ID in .env before starting the local sign-in server.');
}

await import('../server/src/index.js');
