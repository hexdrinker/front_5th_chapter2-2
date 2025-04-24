import { defineConfig as defineTestConfig, mergeConfig } from "vitest/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default mergeConfig(
  defineConfig({
    base: "./",
    plugins: [react()],
    build: {
      rollupOptions: {
        input: {
          refactoring: new URL("./index.refactoring.html", import.meta.url)
            .pathname,
        },
      },
    },
  }),
  defineTestConfig({
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/setupTests.ts",
    },
  }),
);
