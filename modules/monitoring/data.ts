import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import { requireSession } from "@/modules/auth/session";
import { classWorkspace } from "@/modules/classes/data";
import type { Content, Kind, Submission } from "@/modules/student/types";
import type { UserDetail } from "@/modules/users/types";

export const monitoringSession = cache(async () => {
  const session = await requireSession();
  if (!["curriculum", "principal"].includes(session.identity.role)) redirect("/dashboard");
  return session;
});
export const monitoringProfile = cache(async () => {
  const { token } = await monitoringSession();
  return backend<UserDetail & { bio: string | null }>("/api/profile", { token });
});
export const monitoringSummary = cache(async () => {
  const { token } = await monitoringSession();
  return backend<Record<Kind, { total: number; published: number; draft: number }>>("/api/learning/summary", { token });
});
export const monitoringClasses = cache(async () => {
  const { token } = await monitoringSession();
  return classWorkspace(token);
});
export const monitoringContent = cache(async (kind: Kind, classID?: number) => {
  const { token } = await monitoringSession();
  const items: Content[] = [];
  for (let offset = 0; ; offset += 100) {
    const { data } = await backend<{ data: Content[] }>(`/api/${kind}?limit=100&offset=${offset}${classID ? `&class_id=${classID}` : ""}`, { token });
    items.push(...data);
    if (data.length < 100) return items;
  }
});
export async function monitoringDetail(kind: Kind, id: string) {
  const { token } = await monitoringSession();
  if (!/^[1-9]\d*$/.test(id)) notFound();
  try { return await backend<Content>(`/api/${kind}/${id}`, { token }); }
  catch (error) { if (error instanceof ApiError && [403, 404].includes(error.status)) notFound(); throw error; }
}
export async function monitoringSubmissions(id: number) {
  const { token } = await monitoringSession();
  return (await backend<{ data: (Submission & { student_user_id: number })[] }>(`/api/assignments/${id}/submissions`, { token })).data;
}
