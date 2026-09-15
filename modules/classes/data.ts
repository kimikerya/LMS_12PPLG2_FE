import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import type { ClassDetail } from "./types";

// Request-scoped memoization. Access is always checked by the API for this token.
export const classWorkspace = cache(async (token: string, summary = false) =>
  (await backend<{ data: ClassDetail[] }>(`/api/classes/workspace${summary ? "?summary=true" : ""}`, { token })).data);

export const classDetail = cache(async (id: string, token: string) => {
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) notFound();
  try { return await backend<ClassDetail>(`/api/classes/${id}`, { token }); }
  catch (error) { if (error instanceof ApiError && [403, 404].includes(error.status)) notFound(); throw error; }
});
