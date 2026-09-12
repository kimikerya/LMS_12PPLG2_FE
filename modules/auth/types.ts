export const roleLabels = {
  student: "Siswa",
  teacher: "Guru",
  admin: "Admin",
  curriculum: "Kurikulum",
  principal: "Kepala Sekolah",
} as const;
export type Role = keyof typeof roleLabels;
export type Identity = { user_id: number; login_id: string; role: Role; exp: number };
export type LoginState = { error?: string };

export function isIdentity(value: unknown): value is Identity {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return Number.isSafeInteger(v.user_id) && Number(v.user_id) > 0 && typeof v.login_id === "string"
    && typeof v.role === "string" && Object.hasOwn(roleLabels, v.role)
    && typeof v.exp === "number" && Number.isFinite(v.exp) && v.exp * 1000 > Date.now();
}
