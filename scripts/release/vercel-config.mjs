import { readFile, writeFile } from "node:fs/promises";
import dotenv from "../../server/node_modules/dotenv/lib/main.js";
import { validateReleaseEnvironment } from "./validate-env.js";
const [input, output] = process.argv.slice(2);
if (!input || !output)
  throw Error("Usage: vercel-config.mjs PRIVATE_FRONTEND_ENV OUTPUT");
const env = dotenv.parse(await readFile(input));
if (validateReleaseEnvironment("frontend", env).length)
  throw Error("Validate real frontend configuration first");
const id = env.VITE_FIREBASE_PROJECT_ID;
if (!/^[a-z0-9-]+$/.test(id))
  throw Error("Invalid Firebase project identifier");
const config = JSON.parse(await readFile("vercel.json", "utf8"));
config.rewrites[0].destination = `https://${id}.firebaseapp.com/__/auth/:path*`;
await writeFile(output, JSON.stringify(config, null, 2));
console.log(
  "Provider routing prepared for the selected Firebase project; not deployed.",
);
