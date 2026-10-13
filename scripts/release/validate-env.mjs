import { readFile } from "node:fs/promises";
import dotenv from "../../server/node_modules/dotenv/lib/main.js";
import { validateReleaseEnvironment } from "./validate-env.js";
const kind = process.argv[2],
  file = process.argv[3];
if (!file)
  throw Error("Usage: validate-env.mjs frontend|backend PRIVATE_ENV_FILE");
const env = dotenv.parse(await readFile(file, "utf8"));
const errors = validateReleaseEnvironment(kind, env);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`${kind} release environment validated; values not printed.`);
