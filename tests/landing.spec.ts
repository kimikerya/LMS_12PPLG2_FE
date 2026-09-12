import { test, expect } from "@playwright/test";

test("landing publik: navigasi, jurusan, bantuan, dan jalur login", async ({ page }) => {
  const errors: string[] = [];
  const externalAssets: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  page.on("request", request => {
    const url = new URL(request.url());
    if (["image", "font"].includes(request.resourceType()) && url.hostname !== "127.0.0.1") externalAssets.push(url.hostname);
  });
  await page.goto("/");
  await expect(page.locator(".landing-header-shell")).toHaveCSS("position", "fixed");
  await expect(page.locator(".landing-main")).toHaveCSS("padding-top", "80px");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Belajar lebih terarah");
  await expect(page).toHaveURL("/");
  await expect(page.locator(".major-card")).toHaveCount(6);
  await expect(page.getByRole("img", { name: "Gedung sekolah dan lapangan SMK Citra Negara" })).toBeVisible();
  await page.getByRole("link", { name: "Kenali sekolah" }).click();
  await expect(page).toHaveURL(/#tentang$/);
  await page.locator("summary").filter({ hasText: "Bagaimana cara mendapatkan akun?" }).click();
  await expect(page.getByText("Akun dibuat oleh administrator sekolah.", { exact: false })).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain("Plus Jakarta Sans");
  expect(await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--primary").trim().toUpperCase())).toBe("#5996FF");
  await page.screenshot({ path: "test-results/landing-desktop.png", fullPage: true, caret: "initial" });
  await page.getByRole("link", { name: "Masuk portal", exact: false }).first().click();
  await expect(page).toHaveURL(/\/login$/);
  expect(errors).toEqual([]);
  expect(externalAssets).toEqual([]);
});

for (const width of [360, 390, 768, 1440]) {
  test(`landing responsif pada ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const brokenImages = await page.locator("img").evaluateAll(images =>
      images.filter(image => image instanceof HTMLImageElement && image.complete && image.naturalWidth === 0).length);
    expect(brokenImages).toBe(0);
    if (width <= 800) {
      await page.getByRole("button", { name: "Buka menu halaman" }).click();
      await page.getByRole("navigation", { name: "Navigasi halaman sekolah" }).getByRole("link", { name: "Jurusan", exact: true }).click();
      await expect(page).toHaveURL(/#jurusan$/);
      await expect(page.getByRole("button", { name: "Buka menu halaman" })).toHaveAttribute("aria-expanded", "false");
    }
    if (width === 390) await page.screenshot({ path: "test-results/landing-mobile.png", fullPage: true, caret: "initial" });
  });
}
