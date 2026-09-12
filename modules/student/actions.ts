"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import type { FormState } from "@/components/ui/form";
import { studentSession } from "./data";
import { safeURL } from "./helpers";
export async function saveStudentProfile(_:FormState,data:FormData):Promise<FormState> {
 const {token}=await studentSession();
 const full_name=String(data.get("full_name")??"").trim(); const bio=String(data.get("bio")??"").trim();
 if (!full_name||[...full_name].length>150||[...bio].length>1000) return {error:"Isi nama (maksimal 150 karakter) dan bio maksimal 1.000 karakter."};
 try { await backend("/api/profile",{token,method:"PATCH",body:{full_name,bio}}); }
 catch(e){return {error:e instanceof ApiError?e.message:"Profil belum berhasil disimpan."};}
 revalidatePath("/", "layout"); redirect("/profil?saved=1");
}
export async function submitStudentTask(id:number,_:FormState,data:FormData):Promise<FormState> {
 const {token}=await studentSession();
 if(!Number.isSafeInteger(id)||id<1) return {error:"Tugas tidak valid."};
 const type=String(data.get("submission_type")); const answer=String(data.get("answer")??"").trim();
 if(!["text","link"].includes(type)||!answer) return {error:"Isi jawaban sebelum dikumpulkan."};
 if(type==="link"&&(!safeURL(answer)||answer.length>500)) return {error:"Gunakan tautan http/https yang valid, maksimal 500 karakter."};
 if(type==="text"&&new TextEncoder().encode(answer).length>60000) return {error:"Jawaban terlalu panjang (maksimal 60 KB)."};
 try { await backend(`/api/assignments/${id}/submissions`,{token,method:"POST",body:{submission_type:type,text_answer:type==="text"?answer:null,link_url:type==="link"?answer:null}}); }
 catch(e){return {error:e instanceof ApiError?e.message:"Jawaban belum berhasil dikirim. Coba kembali."};}
 revalidatePath("/dashboard");revalidatePath("/kelas","page");revalidatePath("/kelas/[id]","page");revalidatePath("/tugas","layout");
 return {success:"Tugas berhasil dikumpulkan. Jawaban Anda sudah diterima."};
}
