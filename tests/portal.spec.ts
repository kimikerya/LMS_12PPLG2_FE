import { test, expect, type Page } from "@playwright/test";
import { learningModules } from "../config/learning";

const admin = { id: process.env.E2E_ADMIN_ID || "ADMIN001", password: process.env.E2E_ADMIN_PASSWORD || "Admin123!" };
const student = { id: process.env.E2E_STUDENT_ID || "STD001", password: process.env.E2E_STUDENT_PASSWORD || "Belajar123!" };
async function login(page: Page, account: typeof admin) {
  await page.goto("/login");
  await page.getByLabel("ID pengguna", { exact: true }).fill(account.id);
  await page.getByLabel("Kata sandi", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Masuk ke portal" }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(account.id === student.id ? /^Halo, .+!$/ : "Halaman Utama");
}

test("istilah dan endpoint tugas terpisah dari ulangan", () => {
  expect(learningModules.assignments.title).toBe("Tugas");
  expect(learningModules.assignments.endpoint).toBe("/api/assignments");
  expect(learningModules.assessments.title).toBe("Asesmen / Ulangan");
  expect(learningModules.assessments.endpoint).toBe("/api/assessments");
});

test("tanpa sesi diarahkan ke satu portal login; password salah ditolak", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await page.screenshot({ path: "test-results/login-desktop.png", fullPage: true, caret: "initial" });
  await page.getByLabel("ID pengguna", { exact: true }).fill(admin.id);
  await page.getByLabel("Kata sandi", { exact: true }).fill("password-salah-untuk-pengujian");
  await page.getByRole("button", { name: "Masuk ke portal" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "ID pengguna atau kata sandi salah" })).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test("admin: dashboard, cookie aman, tab peran, pencarian, dan logout", async ({ page, context }) => {
  const browserApiRequests: string[] = [];
  page.on("request", request => { if (new URL(request.url()).port === "8080") browserApiRequests.push(request.url()); });
  await login(page, admin);
  const cookie = (await context.cookies()).find(c => c.name === "ems_session");
  expect(cookie?.httpOnly).toBe(true);
  expect(cookie?.sameSite).toBe("Lax");
  expect(await page.evaluate(() => document.cookie.includes("ems_session"))).toBe(false);
  expect(await page.evaluate(() => localStorage.length)).toBe(0);
  // Boolean comparison prevents JWT from appearing in a failed assertion's output.
  expect((await page.content()).includes(cookie!.value)).toBe(false);
  await page.screenshot({ path: "test-results/dashboard-admin.png", fullPage: true });
  await expect(page.locator("#sidebar")).toHaveCSS("width", "260px");
  await page.getByRole("link", { name: /^Akun aktif/ }).click();
  await expect(page.getByRole("combobox", { name: "Filter status" })).toHaveValue("active");
  await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Pengguna", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Manajemen Pengguna" })).toBeVisible();
  await page.getByRole("navigation", { name: "Filter peran pengguna" }).getByRole("link", { name: "Siswa", exact: true }).click();
  await expect(page).toHaveURL(/role=student$/);
  await page.getByRole("textbox", { name: "Cari pengguna" }).fill(student.id);
  await expect(page.getByRole("cell", { name: student.id, exact: true })).toBeVisible();
  await page.getByRole("combobox", { name: "Filter status" }).selectOption("inactive");
  await expect(page.getByRole("heading", { name: "Tidak ada pengguna yang sesuai" })).toBeVisible();
  await page.getByRole("combobox", { name: "Filter status" }).selectOption("");
  await page.screenshot({ path: "test-results/pengguna-admin.png", fullPage: true });
  await page.getByRole("button", { name: "Keluar dari akun", exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect((await context.cookies()).some(c => c.name === "ems_session")).toBe(false);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  expect(browserApiRequests).toEqual([]);
});

test("siswa: tugas dan ulangan terpisah, data pengguna admin tidak terbuka", async ({ page }) => {
  await login(page, student);
  const nav = page.getByRole("navigation", { name: "Navigasi utama" });
  await expect(nav.getByRole("link", { name: "Pengguna", exact: true })).toHaveCount(0);
  await expect(nav.getByRole("link")).toHaveText(["Dashboard", "Kelas Saya", "Profil"]);
  await page.goto("/tugas");
  await expect(page.getByRole("heading", { name: "Tugas Saya", exact: true })).toBeVisible();
  await page.goto("/asesmen");
  await expect(page.getByRole("heading", { name: "Asesmen Saya", exact: true })).toBeVisible();
  await page.goto("/pengguna");
  await expect(page.getByRole("heading", { name: "Akses khusus administrator" })).toBeVisible();
  await expect(page.getByRole("table")).toHaveCount(0);
  await page.goto("/materi");
  await expect(page.getByRole("heading", { name: "Materi Saya", exact: true })).toBeVisible();
  await page.goto("/kelas");
  await expect(page.getByRole("heading", { name: "Kelas Saya", exact: true })).toBeVisible();
});

test("mobile: login dan navigasi tidak meluber horizontal", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/login");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await login(page, student);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: "test-results/dashboard-mobile.png", fullPage: true });
  await page.getByRole("button", { name: "Buka navigasi" }).click();
  await page.getByRole("navigation", { name: "Navigasi utama" }).getByRole("link", { name: "Profil", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Profil Saya", exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Buka navigasi" })).toHaveAttribute("aria-expanded", "false");
});
