import { defineConfig, mergeConfig } from "vite";
import application from "../../vite.config.js";

// A second API origin must not rewrite the owner's optimizer cache.
export default defineConfig((environment) =>
  mergeConfig(application(environment), {
    cacheDir: "node_modules/.vite-isolated-qa",
    server: { port: 4175, host: "127.0.0.1", strictPort: true },
  }),
);
