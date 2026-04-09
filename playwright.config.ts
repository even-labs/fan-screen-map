/**
 * Playwright config for fan-screen-map capture script.
 * Minimal — only used to run scripts/screen-map-capture.spec.ts
 */
import { defineConfig, devices } from "@playwright/test";

const port = process.env.E2E_PORT ?? "3004";
const baseURL = process.env.BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: "./scripts",
  timeout: 600_000,
  use: {
    baseURL,
    ...devices["Desktop Chrome"],
    viewport: { width: 1440, height: 900 },
    video: "off",
    screenshot: "off",
    trace: "off",
  },
});
