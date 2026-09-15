import { roleLabels, type Role } from "@/modules/auth/types";
import { PASSWORD_ERROR, validPassword } from "@/modules/auth/password-policy";

export const csvColumns = ["login_id", "full_name", "email", "role", "password", "nis", "nisn", "nik", "nuptk", "employee_id", "birth_place", "birth_date", "phone"] as const;
export type ImportUser = Record<typeof csvColumns[number], string> & { status: string };
export type PreviewRow = { row: number; user: ImportUser; errors: string[] };
export const csvTemplate = csvColumns.filter(key => key !== "nik").join(",") + "\r\n";
const aliases: Record<string, string> = { "id pengguna": "login_id", "nama lengkap": "full_name", "nama": "full_name", "alamat email": "email", "peran": "role", "peran pengguna": "role", "kata sandi": "password", "kata sandi awal": "password", "nip": "employee_id", "nomor pegawai": "employee_id", "nip / nomor pegawai": "employee_id", "tempat lahir": "birth_place", "tanggal lahir": "birth_date", "nomor hp": "phone", "no hp": "phone" };
export function normalizeHeader(value: string) { const key = value.trim().toLowerCase(); return aliases[key] ?? key; }
export function tableToCSV(records: string[][]): string { return records.map(row => row.map(cell => `"${cell.replaceAll('"', '""')}"`).join(",")).join("\r\n"); }

export function validateUser(user: Partial<ImportUser>, create = true): string[] {
  const errors: string[] = [];
  if ((!create && !user.login_id?.trim()) || (user.login_id?.length ?? 0) > 100) errors.push("ID pengguna wajib diisi, maksimal 100 karakter");
  if (!user.full_name?.trim() || user.full_name.length > 150) errors.push("Nama wajib diisi, maksimal 150 karakter");
  if (user.email && (user.email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email))) errors.push("Email tidak valid");
  if ((user.birth_place?.length ?? 0) > 100) errors.push("Tempat lahir maksimal 100 karakter");
  if (user.birth_date) {
    const date = new Date(user.birth_date + "T00:00:00Z");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(user.birth_date) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== user.birth_date || user.birth_date < "1900-01-01" || user.birth_date > new Date().toISOString().slice(0, 10)) errors.push("Tanggal lahir harus valid, mulai tahun 1900 dan tidak di masa depan");
  }
  if (user.phone && (user.phone.length > 25 || !/^\+?[0-9][0-9 ()-]{6,23}[0-9]$/.test(user.phone))) errors.push("Nomor HP tidak valid (8–25 karakter)");
  if (!Object.hasOwn(roleLabels, user.role ?? "")) errors.push("Peran tidak valid");
  const password = user.password ?? "";
  if ((create || password !== "") && !validPassword(password)) errors.push(PASSWORD_ERROR);
  if (user.role === "student" && !user.nis?.trim()) errors.push("NIS wajib untuk siswa");
  for (const key of ["nis", "nisn", "nik", "nuptk", "employee_id"] as const) if ((user[key]?.length ?? 0) > 50) errors.push(`${key.toUpperCase()} maksimal 50 karakter`);
  return errors;
}

// CSV and clipboard TSV share the same validation on browser and server.
export function previewCSV(source: string): PreviewRow[] {
  if (new TextEncoder().encode(source).length > 100_000) throw new Error("Berkas maksimal 100 KB.");
  source = source.replace(/^\uFEFF/, "");
  const firstLine = source.split(/\r?\n/, 1)[0];
  const separator = firstLine.includes("\t") ? "\t" : firstLine.includes(";") ? ";" : ",";
  const records: string[][] = [];
  let cells: string[] = [], cell = "", quoted = false, closed = false;
  const finishCell = () => { cells.push(cell); cell = ""; closed = false; };
  const finishRow = () => { finishCell(); if (cells.some(value => value.trim())) records.push(cells); cells = []; };
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (quoted) {
      if (char === '"') { if (source[i + 1] === '"') { cell += '"'; i++; } else { quoted = false; closed = true; } }
      else cell += char;
    } else if (char === separator) finishCell();
    else if (char === "\n" || char === "\r") { if (char === "\r" && source[i + 1] === "\n") i++; finishRow(); }
    else if (char === '"' && cell === "" && !closed) quoted = true;
    else { if (closed || char === '"') throw new Error("Format tanda kutip CSV tidak valid."); cell += char; }
  }
  if (quoted) throw new Error("Ada tanda kutip CSV yang belum ditutup.");
  finishRow();
  const header = records.shift()?.map(normalizeHeader) ?? [];
  if (new Set(header).size !== header.length || ["full_name", "role", "password"].some(key => !header.includes(key)) || header.some(key => !(csvColumns as readonly string[]).includes(key))) throw new Error("Periksa judul kolom. Wajib: Nama lengkap, Peran, Kata sandi. ID kosong dibuat otomatis. Gunakan kolom dari template; email dan data pribadi opsional.");
  if (!records.length || records.length > 50) throw new Error("Isi 1–50 pengguna per import.");
  const rows = records.map((record, index) => {
    const user = Object.fromEntries(csvColumns.map(key => { const value = record[header.indexOf(key)] ?? ""; return [key, key === "password" ? value : value.trim()]; })) as ImportUser;
    user.status = "active";
    user.role = Object.entries(roleLabels).find(([key, label]) => key === user.role.toLowerCase() || label.toLowerCase() === user.role.toLowerCase())?.[0] ?? user.role;
    // Day/month/year from Indonesian spreadsheet text; native Excel dates become ISO before this step.
    user.birth_date = user.birth_date.replace(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, (_all, day, month, year) => `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
    return { row: index + 2, user, errors: [...(record.length !== header.length ? ["Jumlah kolom tidak sesuai header"] : []), ...validateUser(user)] };
  });
  for (const key of ["login_id", "email", "nis", "nisn", "nik", "nuptk", "employee_id"] as const) {
    const seen = new Map<string, PreviewRow>();
    for (const row of rows) {
      const value = row.user[key].toLowerCase();
      if (!value) continue;
      const previous = seen.get(value);
      if (previous) { const error = `${key.toUpperCase()} duplikat dalam berkas`; row.errors.push(error); if (!previous.errors.includes(error)) previous.errors.push(error); }
      else seen.set(value, row);
    }
  }
  return rows;
}
export function importRoleLabel(role: string) { return roleLabels[role as Role] ?? role; }
