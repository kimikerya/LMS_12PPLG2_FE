import { test, expect } from "@playwright/test";

// Opt-in: hentikan API lokal terlebih dahulu, frontend tetap berjalan.
test("API offline: login menampilkan pesan aman dan tidak membuat sesi", async ({ page, context }) => {
  test.skip(process.env.E2E_API_OFFLINE !== "1", "Hanya dijalankan saat API sengaja dihentikan.");
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Belajar lebih terarah");
  await page.goto("/login");
  await page.getByLabel("ID pengguna", { exact: true }).fill("OFFLINE_TEST");
  await page.getByLabel("Kata sandi", { exact: true }).fill("offline-test-password");
  await page.getByRole("button", { name: "Masuk ke portal" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Layanan sekolah belum dapat dihubungi" })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  expect((await context.cookies()).some(c => c.name === "ems_session")).toBe(false);
});
