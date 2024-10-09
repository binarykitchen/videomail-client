/// <reference types="vitest/config" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from "vite";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts?(x)"],
    environment: "jsdom",
    globals: true,
  },
});
