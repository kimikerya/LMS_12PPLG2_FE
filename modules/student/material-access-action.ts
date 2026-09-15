"use server";
import { backend } from "@/lib/api";
import { studentSession } from "./data";
export async function recordMaterialAccess(id:number){try{const {token}=await studentSession();if(!Number.isSafeInteger(id)||id<=0)return;await backend(`/api/materials/${id}/access`,{token,method:"POST"});}catch{/* Reading materials remains available when tracking is temporarily unavailable. */}}
