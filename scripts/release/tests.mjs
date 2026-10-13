import { readdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
const integration = process.argv.includes("--integration"),
  files = [];
async function walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = `${dir}/${e.name}`;
    if (e.isDirectory()) await walk(p);
    else if (
      /\.test\.(mjs|js)$/.test(p) &&
      p.includes(".integration.") === integration
    )
      files.push(p);
  }
}
for (const d of [
  "tests",
  "src",
  "server/src",
  "server/study",
  "server/scripts",
  "scripts/release",
])
  await walk(d);
if (!files.length) throw Error("No tests discovered");
const flags = integration
  ? Object.fromEntries(
      [
        "RUN_CATALOG_INTEGRATION",
        "RUN_RESET_INTEGRATION",
        "RUN_QUIZ_INTEGRATION",
        "RUN_PAID_ACCESS_TEST",
        "RUN_STUDY_INTEGRATION",
        "RUN_PUBLIC_STUDY_TEST",
        "RUN_TABLE_SESSION_TEST",
        "RUN_OPS_INTEGRATION",
      ].map((k) => [k, "1"]),
    )
  : {};
const r = spawnSync(process.execPath, ["--test", ...files.sort()], {
  stdio: "inherit",
  env: { ...process.env, ...flags },
});
process.exit(r.status ?? 1);
