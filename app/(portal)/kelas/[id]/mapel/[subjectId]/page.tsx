import { notFound } from "next/navigation";
import { studentClasses } from "@/modules/student/data";
import { classSubjects } from "@/modules/student/subjects";
import { StudentClassWorkspace } from "@/modules/student/class-workspace";
export const metadata = { title: "Mata Pelajaran" };
export default async function Page({params, searchParams}: {params: Promise<{id: string; subjectId: string}>; searchParams: Promise<{tab?: string}>}) {
  const {id, subjectId} = await params;
  if (!/^[1-9]\d*$/.test(id) || !/^[1-9]\d*$/.test(subjectId)) notFound();
  const classroom = (await studentClasses()).find(c => String(c.id) === id);
  if (!classroom) notFound();
  const subject = classSubjects(classroom).find(s => String(s.id) === subjectId);
  if (!subject) notFound();
  return <StudentClassWorkspace classroom={classroom} subject={subject} tab={(await searchParams).tab} />;
}
