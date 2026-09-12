import "server-only";
import { ApiError } from "./api";
import { requireSession } from "@/modules/auth/session";

export async function requireAdmin() {
  const session = await requireSession();
  if (session.identity.role !== "admin") throw new ApiError(403, "Akses khusus administrator.");
  return session;
}
export function mutationError(error: unknown) {
  if (error instanceof ApiError) {
    if (error.status === 503) return "Layanan belum dapat dihubungi. Jika tadi sudah menekan Simpan, periksa daftar data sebelum mencoba lagi.";
    return error.message;
  }
  return "Perubahan belum dapat diproses. Silakan coba kembali.";
}
export function formText(data: FormData, key: string) { const value = data.get(key); return typeof value === "string" ? value.trim() : ""; }
export function positiveID(value: string | number) { const id = Number(value); if (!Number.isSafeInteger(id) || id < 1) throw new ApiError(422, "Pilihan data tidak valid."); return id; }

export async function requireClassCreator() { const session = await requireSession(); if (!["admin", "teacher"].includes(session.identity.role)) throw new ApiError(403, "Akses khusus admin dan guru."); return session; }
