/// <reference types="vitest" />
import { resolve } from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import topLevelAwait from "vite-plugin-top-level-await";
import wasm from "vite-plugin-wasm";

export default defineConfig({
  plugins: [react(), topLevelAwait(), wasm()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      "@utils": resolve(__dirname, "src/utils"),
      "@layouts": resolve(__dirname, "src/layouts"),
      "@data": resolve(__dirname, "src/data"),
      "@state": resolve(__dirname, "src/state"),
      "@components": resolve(__dirname, "src/components"),
      "@pages": resolve(__dirname, "src/pages"),
    },
  },
  server: {
    proxy: {
      "/api": {
        // target: "http://127.0.0.1:10086",
        target: "https://plana-NoBugNoPain.app.secoder.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  test: {
    coverage: {
      provider: "c8",
      reporter: ["text", "lcov"],
    },
  },
});
