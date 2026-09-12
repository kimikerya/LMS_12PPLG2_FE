import { defineConfig } from "@playwright/test";

// Jalankan API dan frontend lokal terlebih dahulu. Tidak menjalankan seed/migration.
export default defineConfig({
  testDir: "./tests",
  testIgnore: ["student.spec.ts", "user-return.spec.ts"],
  fullyParallel: false,
  workers: 1,
  timeout: 45_000,
  expect: { timeout: 15_000 },
  reporter: "list",
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3000",
    browserName: "chromium",
    channel: process.env.PLAYWRIGHT_CHANNEL || "msedge",
    viewport: { width: 1440, height: 1000 },
    // Trace dapat merekam kredensial/cookie. Jangan simpan sesi login.
    trace: "off",
    screenshot: "only-on-failure",
  },
});
