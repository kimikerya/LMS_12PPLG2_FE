"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backend } from "@/lib/api";
import { formText, mutationError, positiveID } from "@/lib/admin";
import type { FormState } from "@/components/ui/form";
import type { Kind } from "@/modules/student/types";
import { teacherSession } from "./data";

function refresh(){for(const path of ["/materi","/tugas","/asesmen","/kelas","/dashboard"])revalidatePath(path,"layout");}
export async function deleteTeachingContent(kind:Kind,id:number):Promise<FormState>{
 const {token}=await teacherSession();
 if(!["materials","assignments","assessments"].includes(kind))return {error:"Konten tidak valid."};
 try{await backend(`/api/${kind}/${positiveID(id)}`,{token,method:"DELETE"});}catch(error){return {error:mutationError(error)};}
 refresh();return {success:"Konten dihapus."};
}
export async function editMaterial(id:number,_previous:FormState,data:FormData):Promise<FormState>{
 const {token}=await teacherSession();
 try{await backend(`/api/materials/${positiveID(id)}`,{token,method:"PATCH",body:{title:formText(data,"title"),description:formText(data,"description"),material_type:formText(data,"material_type"),meeting_no:formText(data,"meeting_no")?positiveID(formText(data,"meeting_no")):null,url:formText(data,"url")}});}catch(error){return {error:mutationError(error)};}
 refresh();redirect(`/materi/${id}?saved=1`);
}
