"use server";
import { revalidatePath } from "next/cache";
import { backend } from "@/lib/api";
import { mutationError, positiveID } from "@/lib/admin";
import { teacherSession } from "@/modules/teacher/data";
import { studentSession } from "@/modules/student/data";
import type { ExamDraft, ExamAnswer, ExamPaper } from "./types";

function refreshAssessment(id:number){revalidatePath(`/asesmen/${id}`);revalidatePath("/asesmen");revalidatePath("/kelas","layout");revalidatePath("/dashboard");}
export async function saveAssessment(id:number|undefined,body:ExamDraft):Promise<{id?:number;error?:string}>{
 const {token}=await teacherSession();
 try{const result=await backend<{id:number}>(id?`/api/assessments/${positiveID(id)}/editor`:"/api/assessments/drafts",{token,method:id?"PUT":"POST",body});refreshAssessment(result.id);return result;}catch(error){return {error:mutationError(error)};}
}
export async function publishAssessment(id:number):Promise<{error?:string}>{
 const {token}=await teacherSession();try{await backend(`/api/assessments/${positiveID(id)}/publish`,{token,method:"POST"});refreshAssessment(id);return {};}catch(error){return {error:mutationError(error)};}
}
export async function startExam(id:number):Promise<{paper?:ExamPaper;error?:string}>{
 const {token}=await studentSession();try{return {paper:await backend<ExamPaper>(`/api/assessments/${positiveID(id)}/start`,{token,method:"POST"})};}catch(error){return {error:mutationError(error)};}
}
export async function saveExam(id:number,answers:ExamAnswer[],submit:boolean):Promise<{status?:string;error?:string}>{
 const {token}=await studentSession();try{return await backend<{status:string}>(`/api/assessment-attempts/${positiveID(id)}/${submit?"submit":"answers"}`,{token,method:submit?"POST":"PUT",body:{answers}});}catch(error){return {error:mutationError(error)};}
}
export async function gradeExam(assessmentID:number,id:number,answers:ExamAnswer[],release:boolean):Promise<{error?:string}>{
 const {token}=await teacherSession();try{await backend(`/api/assessment-attempts/${positiveID(id)}/${release?"release":"grade"}`,{token,method:release?"POST":"PATCH",...(release?{}:{body:{answers}})});refreshAssessment(assessmentID);return {};}catch(error){return {error:mutationError(error)};}
}
