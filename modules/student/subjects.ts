import type { ClassDetail } from "@/modules/classes/types";
export type ClassSubject = { id: number; name: string; teachers: string[] };
export function classSubjects(classroom: ClassDetail): ClassSubject[] {
  const subjects = new Map<number, ClassSubject>();
  for (const teacher of classroom.teachers) {
    if (teacher.status !== "active" || !teacher.subject_id) continue;
    const subject = subjects.get(teacher.subject_id) ?? {id: teacher.subject_id, name: teacher.subject_name || "Mata pelajaran", teachers: []};
    if (!subject.teachers.includes(teacher.full_name)) subject.teachers.push(teacher.full_name);
    subjects.set(subject.id, subject);
  }
  return [...subjects.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));
}
export function subjectHref(classID: number, subjectID: number) { return `/kelas/${classID}/mapel/${subjectID}`; }
