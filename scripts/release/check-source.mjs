import { readdir, readFile } from "node:fs/promises";
import { transform } from "esbuild";
async function inspect(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = `${dir}/${entry.name}`;
    if (entry.isDirectory()) await inspect(path);
    else if (/\.(jsx?|mjs)$/.test(path))
      await transform(await readFile(path, "utf8"), {
        loader: path.endsWith(".jsx") ? "jsx" : "js",
        sourcefile: path,
      });
  }
}
for (const dir of [
  "src",
  "scripts",
  "server/src",
  "server/study",
  "server/scripts",
])
  await inspect(dir);
console.log(
  "JavaScript/JSX syntax checks passed. This is syntax lint, not semantic ESLint.",
);
