"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api";
import { formText, mutationError } from "@/lib/admin";
import type { FormState } from "@/components/ui/form";
import { monitoringSession } from "./data";

export async function saveCurriculumProfile(_previous: FormState, data: FormData): Promise<FormState> {
  const { token } = await monitoringSession();
  try { await backend("/api/profile", { token, method: "PATCH", body: { full_name: formText(data, "full_name"), bio: formText(data, "bio") } }); }
  catch (error) { return { error: mutationError(error) }; }
  revalidatePath("/", "layout");
  redirect("/profil?saved=1");
}
