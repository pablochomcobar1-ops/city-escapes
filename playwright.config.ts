import { defineConfig, devices } from "@playwright/test";

// Tests always build and serve a fresh copy on port 3005, so they never hit
// your `npm run dev` on 3000 or a leftover server from an older build.
const PORT = 3005;
const CROSS_BROWSER = /(smoke|pages|home|contact|theme|layout|headers|a11y)\.spec\.ts/;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: { baseURL: `http://localhost:${PORT}`, trace: "retain-on-failure" },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "phone", use: { ...devices["Pixel 7"] } },
    // Cross-browser: the page-level specs in Firefox and in Safari's engine on an iPhone.
    { name: "firefox", use: { ...devices["Desktop Firefox"] }, testMatch: CROSS_BROWSER },
    { name: "iphone", use: { ...devices["iPhone 14"] }, testMatch: CROSS_BROWSER },
  ],
  webServer: {
    command: `npm run build && npx next start -p ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
