import { validateReleaseEnvironment } from "./scripts/release/validate-env.js";
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { assertCleanReleaseSources } from "./scripts/release/clean-source.js";

export default defineConfig(({ mode }) => {
  let evidence;
  if (process.env.RELEASE_BUILD === "true") {
    const env = {
      ...loadEnv(mode, process.cwd(), "VITE_"),
      ...Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key.startsWith("VITE_")),
      ),
    };
    const errors = validateReleaseEnvironment("frontend", env);
    if (errors.length) throw new Error(errors.join("; "));
    const revisions = assertCleanReleaseSources();
    evidence = {
      schema: 1,
      validated: true,
      mode,
      apiOrigin: new URL(env.VITE_API_URL).origin,
      frontend: revisions.frontend,
      backend: revisions.backend,
    };
  }
  return {
    plugins: [
      react(),
      ...(evidence
        ? [
            {
              name: "release-build-evidence",
              generateBundle() {
                const current = assertCleanReleaseSources();
                if (
                  current.frontend !== evidence.frontend ||
                  current.backend !== evidence.backend
                )
                  throw Error("Release source changed during the build.");
                this.emitFile({
                  type: "asset",
                  fileName: "release-build.json",
                  source: JSON.stringify(evidence),
                });
              },
            },
          ]
        : []),
    ],
    server: {
      port: 4174,
      host: "127.0.0.1",
      strictPort: true,
    },
  };
});
