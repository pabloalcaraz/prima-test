/// <reference types="vitest/config" />

import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["src/**/*.test.{js,ts,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
  },
});
