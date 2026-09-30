import { requireSession } from "@/modules/auth/session";
import { TeacherSubjectPage } from "@/modules/teacher/content";
import { notFound, redirect } from "next/navigation";
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
  // A class/subject assignment may have been removed after a bookmarked card
  // was rendered. Keep the student inside their authorized class instead of
  // showing a misleading generic 404 page.
  if (!subject) redirect(`/kelas?kelas=${encodeURIComponent(id)}&subject=unavailable`);
  return <StudentClassWorkspace classroom={classroom} subject={subject} tab={(await searchParams).tab} />;
}
