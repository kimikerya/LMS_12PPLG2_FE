"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api";
import { formText, mutationError, positiveID } from "@/lib/admin";
import type { FormState } from "@/components/ui/form";
import { teacherSession, teacherSubject } from "./data";

export async function createTeachingContent(classID:number,subjectID:number,kind:"materials"|"assignments",_previous:FormState,data:FormData):Promise<FormState> {
  const {token}=await teacherSession();
  await teacherSubject(String(classID),String(subjectID));
  if(kind!=="materials"&&kind!=="assignments") return {error:"Jenis konten tidak valid."};
  let id:number;
  try {
    const base={class_id:classID,subject_id:subjectID,title:formText(data,"title")};
    const meeting=formText(data,"meeting_no");
    // School deadlines are entered as WIB, independently of server/browser timezone.
    const due=formText(data,"due_at"), close=formText(data,"close_at");
    const body=kind==="materials"?{...base,description:formText(data,"description"),material_type:formText(data,"material_type"),url:formText(data,"url"),meeting_no:meeting?positiveID(meeting):null}:{...base,instructions:formText(data,"instructions"),due_at:due?new Date(`${due}:00+07:00`).toISOString():null,close_at:close?new Date(`${close}:00+07:00`).toISOString():null,allow_late:data.get("allow_late")==="on",max_points:Number(formText(data,"max_points"))};
    const result=await backend<{id:number}>(`/api/${kind}`,{token,method:"POST",body}); id=result.id;
  } catch(error) { return {error:mutationError(error)}; }
  revalidatePath("/kelas","layout"); revalidatePath("/dashboard");
  revalidatePath(kind==="materials"?"/materi":"/tugas");
  redirect(`/${kind==="materials"?"materi":"tugas"}/${id}?created=1`);
}
export async function publishTeachingContent(kind:"materials"|"assignments",id:number):Promise<FormState> {
  const {token}=await teacherSession();
  if(kind!=="materials"&&kind!=="assignments") return {error:"Jenis konten tidak valid."};
  try { await backend(`/api/${kind}/${positiveID(id)}/publish`,{token,method:"POST"}); }
  catch(error) { return {error:mutationError(error)}; }
  revalidatePath("/kelas","layout"); revalidatePath("/dashboard"); revalidatePath("/materi","layout"); revalidatePath("/tugas","layout");
  return {success:"Berhasil diterbitkan. Siswa di kelas ini dapat membukanya."};
}
export async function gradeAnswer(assignmentID:number,id:number,_previous:FormState,data:FormData):Promise<FormState> {
  const {token}=await teacherSession();
  try {
    const raw=formText(data,"score");
    if(!raw) return {error:"Nilai wajib diisi."};
    await backend(`/api/submissions/${positiveID(id)}/grade`,{token,method:"PATCH",body:{score:Number(raw),teacher_feedback:formText(data,"teacher_feedback")}});
  } catch(error) { return {error:mutationError(error)}; }
  revalidatePath(`/tugas/${assignmentID}`);
  return {success:"Nilai tersimpan. Rilis nilai agar siswa dapat melihatnya."};
}
export async function releaseAnswer(assignmentID:number,id:number):Promise<FormState> {
  const {token}=await teacherSession();
  try { await backend(`/api/submissions/${positiveID(id)}/release`,{token,method:"POST"}); }
  catch(error) { return {error:mutationError(error)}; }
  revalidatePath(`/tugas/${assignmentID}`); revalidatePath("/dashboard");
  return {success:"Nilai telah dirilis kepada siswa."};
}
export async function saveTeacherProfile(_previous:FormState,data:FormData):Promise<FormState> {
  const {token}=await teacherSession();
  try { await backend("/api/profile",{token,method:"PATCH",body:{full_name:formText(data,"full_name"),bio:formText(data,"bio")}}); }
  catch(error) { return {error:mutationError(error)}; }
  revalidatePath("/","layout"); redirect("/profil?saved=1");
}
