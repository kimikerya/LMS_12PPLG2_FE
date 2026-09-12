"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api";
import { formText, mutationError, positiveID, requireAdmin } from "@/lib/admin";
import type { FormState } from "@/components/ui/form";
import type { UserDetail } from "./types";
import { userReturnPath, userResultPath } from "./return-path";
import { csvColumns, previewCSV, validateUser, type ImportUser } from "./csv";

export async function saveUser(id: number | null, _previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  let savedID: number;
  try {
    const user = Object.fromEntries(csvColumns.map(key => [key, key === "password" ? String(data.get(key) ?? "") : formText(data, key)])) as ImportUser;
    if (id !== null) {
      const existing = await backend<UserDetail>(`/api/users/${positiveID(id)}`, { token: session.token });
      user.role = existing.role; user.status = existing.status;
      user.nik = existing.nik ?? "";
      if (existing.role === "admin") user.nuptk = existing.nuptk ?? "";
    } else user.status = formText(data, "status") || "active";
    const errors = validateUser(user, id === null);
    if (errors.length) return { error: errors.join(". "), role: user.role };
    if (id !== null) {
      await backend(`/api/users/${id}`, { token: session.token, method: "PATCH", body: user }); savedID = id;
    } else {
      const result = await backend<UserDetail>("/api/users", { token: session.token, method: "POST", body: user }); savedID = result.id;
    }
  } catch (error) { return { error: mutationError(error), role: String(data.get("role") ?? "student") }; }
  revalidatePath("/pengguna"); revalidatePath("/kelas", "layout"); revalidatePath("/dashboard");
  if (id !== null) revalidatePath(`/pengguna/${id}`);
  const returnTo = userReturnPath(data.get("returnTo"));
  if (returnTo || id === null) redirect(userResultPath(returnTo ?? "/pengguna", id === null ? "created" : "saved"));
  redirect(`/pengguna/${savedID}?saved=1`);
}

export async function changeUserStatus(id: number, _previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  try {
    await backend(`/api/users/${positiveID(id)}/status`, { token: session.token, method: "PATCH", body: { status: formText(data, "status") } });
  } catch (error) { return { error: mutationError(error) }; }
  revalidatePath("/pengguna"); revalidatePath(`/pengguna/${id}`); revalidatePath("/dashboard");
  return { success: "Status akun berhasil diperbarui." };
}

export async function importUsers(_previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  let count: number;
  try {
    const rows = previewCSV(String(data.get("csv") ?? ""));
    if (rows.some(row => row.errors.length)) return { error: "Perbaiki semua baris yang bermasalah sebelum menyimpan." };
    const result = await backend<{ count: number }>("/api/users/import", { token: session.token, method: "POST", body: { users: rows.map(row => row.user) } });
    count = result.count;
  } catch (error) { return { error: error instanceof Error && !("status" in error) ? error.message : mutationError(error) }; }
  revalidatePath("/pengguna"); revalidatePath("/dashboard");
  redirect(`/pengguna?imported=${count}`);
}

export async function deleteUser(id: number, returnTo: string | null): Promise<FormState> {
 const session = await requireAdmin();
 try { await backend(`/api/users/${positiveID(id)}`, {token:session.token, method:"DELETE"}); }
 catch(error) {return {error:mutationError(error)};}
 revalidatePath("/pengguna", "layout"); revalidatePath("/kelas", "layout"); revalidatePath("/dashboard");
 redirect(userResultPath(userReturnPath(returnTo) ?? "/pengguna", "deleted"));
}
