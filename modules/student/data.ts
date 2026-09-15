import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import { requireSession } from "@/modules/auth/session";
import { classWorkspace } from "@/modules/classes/data";
import type { UserDetail } from "@/modules/users/types";
import type { Content, Kind, Submission } from "./types";

// A single server timestamp per request keeps all deadline labels consistent.
export const studentRequestTime = cache(() => Date.now());

export const studentSession = cache(async () => {
  const session = await requireSession();
  if (session.identity.role !== "student") redirect("/dashboard");
  return session;
});
export const studentProfile = cache(async () => {
  const { token } = await studentSession();
  return backend<UserDetail & { bio: string | null }>("/api/profile", { token });
});
export const studentClasses = cache(async () => {
  const { token } = await studentSession();
  return classWorkspace(token);
});
export const studentContent = cache(async (kind: Kind, classID?: number, subjectID?: number) => {
  const { token } = await studentSession();
  const items: Content[] = [];
  for (let offset = 0; ; offset += 100) {
    const {data} = await backend<{data: Content[]}>(`/api/${kind}?limit=100&offset=${offset}${classID ? `&class_id=${classID}` : ""}${subjectID ? `&subject_id=${subjectID}` : ""}`, {token});
    items.push(...data);
    if (data.length < 100) return items;
  }
});
export async function studentDetail(kind: Kind, id: string) {
  if (!/^[1-9]\d*$/.test(id)) notFound();
  const {token} = await studentSession();
  try { return await backend<Content>(`/api/${kind}/${id}`, {token}); }
  catch (error) { if (error instanceof ApiError && [403,404].includes(error.status)) notFound(); throw error; }
}
export async function studentSubmissions(id: number) {
  const {token} = await studentSession();
  return (await backend<{data: Submission[]}>(`/api/assignments/${id}/submissions`, {token})).data;
}
export type AssessmentReview = {
  id: number; submitted_at: string | null; result_released_at: string | null;
  score: number | null; max_points: number | null;
  answers: { id: number; order: number; question: string; answer: string | null; points: number | null; max_points: number; feedback: string | null; options: string[] }[];
};
export async function studentAssessmentResults(id: number) {
  const { token } = await studentSession();
  return (await backend<{ data: AssessmentReview[] }>(`/api/assessments/${id}/results`, { token })).data;
}
