import "server-only";
import { notFound } from "next/navigation";
import { backend, ApiError } from "@/lib/api";
import type { ClassDetail } from "./types";
export async function classDetail(id: string, token: string) {
  if (!/^\d+$/.test(id) || !Number.isSafeInteger(Number(id)) || Number(id) < 1) notFound();
  try { return await backend<ClassDetail>(`/api/classes/${id}`, { token }); }
  catch (error) { if (error instanceof ApiError && error.status === 404) notFound(); throw error; }
}
