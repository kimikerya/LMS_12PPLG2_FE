import "server-only";
import { cache } from "react";
import { notFound, redirect } from "next/navigation";
import { backend, ApiError } from "@/lib/api";
import { requireSession } from "@/modules/auth/session";
import { classDetail, classWorkspace } from "@/modules/classes/data";
import type { UserDetail } from "@/modules/users/types";
import type { Content, Kind, Submission } from "@/modules/student/types";
import { classSubjects } from "@/modules/student/subjects";

export const teacherRequestTime = cache(() => Date.now());

export const teacherSession = cache(async () => {
  const session = await requireSession();
  if (session.identity.role !== "teacher") redirect("/dashboard");
  return session;
});
export const teacherProfile = cache(async () => {
  const {token} = await teacherSession();
  return backend<UserDetail & {bio: string|null}>("/api/profile", {token});
});
export const teacherClasses = cache(async () => {
  const {token} = await teacherSession();
  return classWorkspace(token);
});
export const teacherContent = cache(async (kind: Kind, classID?: number, subjectID?: number) => {
  const {token} = await teacherSession();
  const items: Content[] = [];
  for(let offset=0;;offset+=100) {
    const {data} = await backend<{data: Content[]}>(`/api/${kind}?limit=100&offset=${offset}${classID?`&class_id=${classID}`:""}${subjectID?`&subject_id=${subjectID}`:""}`,{token});
    items.push(...data); if(data.length<100) return items;
  }
});
export async function teacherSubject(classID: string, subjectID: string) {
  const session = await teacherSession();
  const classroom = await classDetail(classID, session.token);
  const own = {...classroom,teachers:classroom.teachers.filter(t=>t.teacher_user_id===session.identity.user_id)};
  const subject = classSubjects(own).find(s=>String(s.id)===subjectID);
  if(!subject) notFound();
  return {classroom,subject};
}
export async function teacherDetail(kind: Kind, id: string) {
  const {token} = await teacherSession();
  if(!/^[1-9]\d*$/.test(id)) notFound();
  try { return await backend<Content>(`/api/${kind}/${id}`,{token}); }
  catch(error) { if(error instanceof ApiError && [403,404].includes(error.status)) notFound(); throw error; }
}
export type TeacherSubmission = Submission & {student_user_id:number};
export async function teacherSubmissions(id:number) {
  const {token} = await teacherSession();
  return (await backend<{data:TeacherSubmission[]}>(`/api/assignments/${id}/submissions`,{token})).data;
}
