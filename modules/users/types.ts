import type { Role } from "@/modules/auth/types";
export type User = { id: number; login_id: string; email: string; full_name: string; role: Role; status: string };
export type UserDetail = User & { birth_place?: string | null; birth_date?: string | null; phone?: string | null; nis?: string | null; nisn?: string | null; nik?: string | null; nuptk?: string | null; employee_id?: string | null };
export const statusLabels: Record<string, string> = { active: "Aktif", inactive: "Nonaktif", locked: "Terkunci", pending: "Menunggu" };
