import type { ClassDetail } from "@/modules/classes/types";
export type ClassSubject = { id: number; name: string; teachers: string[] };
export function classSubjects(classroom: ClassDetail): ClassSubject[] {
  const subjects = new Map<number, ClassSubject>();
  for (const teacher of classroom.teachers) {
    // The workspace API already filters assignments to ct.status='active' and
    // excludes deleted teachers. `teacher.status` is users.status, which may
    // be pending/inactive and must not hide an otherwise valid class subject.
    if (!teacher.subject_id) continue;
    const subject = subjects.get(teacher.subject_id) ?? {id: teacher.subject_id, name: teacher.subject_name || "Mata pelajaran", teachers: []};
    if (!subject.teachers.includes(teacher.full_name)) subject.teachers.push(teacher.full_name);
    subjects.set(subject.id, subject);
  }
  return [...subjects.values()].sort((a, b) => a.name.localeCompare(b.name, "id"));
}
export function subjectHref(classID: number, subjectID: number) { return `/kelas/${classID}/mapel/${subjectID}`; }
