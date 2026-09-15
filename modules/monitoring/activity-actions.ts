"use server";
import { revalidatePath } from "next/cache";
import { backend } from "@/lib/api";
import { mutationError } from "@/lib/admin";
import { monitoringSession } from "./data";
export async function addActivityReview(input:{user_id:number;class_id:number;subject_id:number;status:string;note:string}){
 const {token,identity}=await monitoringSession();if(identity.role!=="curriculum")return {error:"Hanya kurikulum yang dapat mencatat tindak lanjut."};
 try{await backend("/api/monitoring/reviews",{token,method:"POST",body:input});revalidatePath("/laporan");return {success:true};}catch(error){return {error:mutationError(error)};}
}
