import type { Content, Kind } from "./types";
export const learningLabels: Record<Kind, string> = {materials:"Materi",assignments:"Tugas",assessments:"Asesmen"};
export const learningPaths: Record<Kind, string> = {materials:"materi",assignments:"tugas",assessments:"asesmen"};
export function date(value?: string | null, withTime = false) {
  if (!value) return "Belum ditentukan";
  return new Intl.DateTimeFormat("id-ID", {dateStyle:"medium", ...(withTime ? {timeStyle:"short" as const} : {}),timeZone:"Asia/Jakarta"}).format(new Date(value)) + (withTime ? " WIB" : "");
}
export function initials(name: string) { return name.trim().split(/\s+/).slice(0,2).map(n => n[0]).join("").toUpperCase(); }
export function closed(item: Content, now = Date.now()) { return !!((item.close_at && new Date(item.close_at).getTime() < now) || (!item.allow_late && item.due_at && new Date(item.due_at).getTime() < now)); }
export function taskStatus(item: Content, now = Date.now()) {
  if (item.submission_status === "graded") return "Sudah dinilai";
  if (item.submission_status) return "Sudah dikumpulkan";
  if (closed(item, now)) return "Pengumpulan ditutup";
  if (item.due_at && new Date(item.due_at).getTime() < now) return "Terlambat";
  return "Belum dikumpulkan";
}
export function assessmentStatus(item: Content, now = Date.now()) {
  if (item.end_at && new Date(item.end_at).getTime() < now) return "Selesai";
  if (item.start_at && new Date(item.start_at).getTime() > now) return "Akan datang";
  return "Terjadwal";
}
export function contentHref(kind: Kind, item: Content, classID?: number) {
  const context = classID ?? item.class_id;
  return `/${learningPaths[kind]}/${item.id}${context ? `?kelas=${context}${item.subject_id ? `&mapel=${item.subject_id}` : ""}` : ""}`;
}
export function safeURL(value?: string | null) {
  if (!value) return null;
  try { const url = new URL(value); return ["https:","http:"].includes(url.protocol) && !url.username && !url.password ? url.href : null; } catch { return null; }
}
