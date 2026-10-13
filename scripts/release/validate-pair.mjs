import { readFile } from "node:fs/promises";
import dotenv from "../../server/node_modules/dotenv/lib/main.js";
import { validateEnvironmentPair } from "./validate-pair.js";
const [front, back] = process.argv.slice(2);
if (!front || !back)
  throw Error(
    "Usage: validate-pair.mjs PRIVATE_FRONTEND_ENV PRIVATE_BACKEND_ENV",
  );
const errors = validateEnvironmentPair(
  dotenv.parse(await readFile(front)),
  dotenv.parse(await readFile(back)),
);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(
  "Paired environment configuration validated without printing credentials. Provider origins and hosted login still require live verification.",
);
