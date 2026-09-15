import { requireSession } from "@/modules/auth/session";
import { TeacherSubjectPage } from "@/modules/teacher/content";
import { notFound } from "next/navigation";
import { studentSession } from "@/modules/student/data";
import { classDetail } from "@/modules/classes/data";
import { classSubjects } from "@/modules/student/subjects";
import { StudentClassWorkspace } from "@/modules/student/class-workspace";
export const metadata = { title: "Mata Pelajaran" };
export default async function Page({params, searchParams}: {params: Promise<{id: string; subjectId: string}>; searchParams: Promise<{tab?: string}>}) {
  const {id, subjectId} = await params;
  if ((await requireSession()).identity.role === "teacher") return <TeacherSubjectPage classID={id} subjectID={subjectId} tab={(await searchParams).tab}/>;
  if (!/^[1-9]\d*$/.test(id) || !/^[1-9]\d*$/.test(subjectId)) notFound();
  const classroom = await classDetail(id, (await studentSession()).token);
  const subject = classSubjects(classroom).find(s => String(s.id) === subjectId);
  if (!subject) notFound();
  return <StudentClassWorkspace classroom={classroom} subject={subject} tab={(await searchParams).tab} />;
}
