import { spawnSync } from "node:child_process";
import { isAbsolute, relative, resolve, sep } from "node:path";

function git(args, cwd) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  if (result.status !== 0) throw Error("Release source metadata unavailable");
  return result.stdout;
}

// This intentionally rejects all uncommitted changes, including documentation.
// Status output is inspected in memory and never included in errors or logs.
export function assertCleanReleaseSources({
  frontendCwd = ".",
  backendCwd = resolve(frontendCwd, "server"),
  runGit = git,
} = {}) {
  const frontendDirectory = resolve(frontendCwd);
  const backendDirectory = resolve(backendCwd);
  const backendPath = relative(frontendDirectory, backendDirectory)
    .split(sep)
    .join("/");
  if (!backendPath || isAbsolute(backendPath) || backendPath.startsWith("../"))
    throw Error("Release backend must be the checked-in nested repository");

  const read = (args, cwd) => {
    try {
      const output = runGit(args, cwd);
      if (typeof output !== "string") throw Error();
      return output.trim();
    } catch {
      throw Error("Release source metadata unavailable");
    }
  };
  const checkClean = () => {
    for (const cwd of [frontendDirectory, backendDirectory])
      if (
        read(
          [
            "status",
            "--porcelain=v1",
            "--untracked-files=all",
            "--ignore-submodules=none",
          ],
          cwd,
        )
      )
        throw Error(
          "Release build requires committed clean frontend and backend sources",
        );
  };

  checkClean();
  const revisions = {
    frontend: read(["rev-parse", "HEAD"], frontendDirectory),
    backend: read(["rev-parse", "HEAD"], backendDirectory),
  };
  for (const revision of Object.values(revisions))
    if (!/^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(revision))
      throw Error("Release source revision unavailable");
  const gitlink = read(
    ["ls-tree", "HEAD", "--", backendPath],
    frontendDirectory,
  );
  const pointer = /^160000 commit ([a-f0-9]{40}|[a-f0-9]{64})\t/.exec(
    gitlink,
  )?.[1];
  if (pointer !== revisions.backend)
    throw Error(
      "Release backend revision must match the frontend's committed gitlink",
    );
  checkClean();
  return revisions;
}
