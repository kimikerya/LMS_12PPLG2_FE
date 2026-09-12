"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api";
import { formText, mutationError, positiveID, requireAdmin, requireClassCreator } from "@/lib/admin";
import type { FormState } from "@/components/ui/form";

export async function saveClass(id: number | null, _previous: FormState, data: FormData): Promise<FormState> {
  const session = id === null ? await requireClassCreator() : await requireAdmin(); let savedID: number;
  try {
    const body = { subject_id: session.identity.role === "teacher" ? positiveID(formText(data,"subject_id")) : null, title: formText(data, "title"), academic_year_id: positiveID(formText(data, "academic_year_id")), education_level_id: positiveID(formText(data, "education_level_id")), major_id: positiveID(formText(data, "major_id")), grade_level: positiveID(formText(data, "grade_level")), room: formText(data, "room"), description: formText(data, "description") };
    if (id !== null) { savedID = positiveID(id); await backend(`/api/classes/${id}`, { token: session.token, method: "PATCH", body }); }
    else { const result = await backend<{ id: number }>("/api/classes", { token: session.token, method: "POST", body }); savedID = result.id; }
  } catch (error) { return { error: mutationError(error) }; }
  revalidatePath("/kelas"); revalidatePath("/dashboard"); revalidatePath(`/kelas/${savedID}`);
  redirect(`/kelas/${savedID}?saved=1`);
}

export async function setMembers(classID: number, _previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  try {
    const userIDs = data.getAll("user_ids").map(value => positiveID(String(value)));
    if (!userIDs.length || userIDs.length > 100) return { error: "Pilih 1–100 siswa." };
    await backend(`/api/classes/${positiveID(classID)}/members`, { token: session.token, method: "POST", body: { user_ids: userIDs, status: formText(data, "status") || "active" } });
  } catch (error) { return { error: mutationError(error) }; }
  revalidatePath(`/kelas/${classID}`); revalidatePath("/kelas");
  return { success: "Keanggotaan siswa berhasil diperbarui." };
}

export async function setTeacher(classID: number, _previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  try {
    await backend(`/api/classes/${positiveID(classID)}/teachers`, { token: session.token, method: "POST", body: { teacher_user_id: positiveID(formText(data, "teacher_user_id")), role: formText(data, "role"), subject_id: formText(data, "subject_id") ? positiveID(formText(data, "subject_id")) : null, status: formText(data, "status") || "active" } });
  } catch (error) { return { error: mutationError(error) }; }
  revalidatePath(`/kelas/${classID}`); revalidatePath("/kelas");
  return { success: "Penugasan guru berhasil diperbarui." };
}

export async function createAnnouncement(classID: number, _previous: FormState, data: FormData): Promise<FormState> {
  const session = await requireAdmin();
  try { await backend(`/api/classes/${positiveID(classID)}/announcements`, { token: session.token, method: "POST", body: { title: formText(data, "title"), content: formText(data, "content") } }); }
  catch (error) { return { error: mutationError(error) }; }
  revalidatePath(`/kelas/${classID}`);
  return { success: "Pengumuman berhasil diterbitkan." };
}

export async function deleteClass(id:number):Promise<FormState>{const session=await requireAdmin();try{await backend(`/api/classes/${positiveID(id)}`,{token:session.token,method:"DELETE"});}catch(error){return {error:mutationError(error)};}revalidatePath("/kelas","layout");revalidatePath("/dashboard");redirect("/kelas?deleted=1");}
