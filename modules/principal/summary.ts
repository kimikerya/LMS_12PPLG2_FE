import type { ClassDetail } from "@/modules/classes/types";

export function schoolSummary(classes: ClassDetail[]) {
  const active = classes.filter(c => c.status === "active");
  const students = new Set(active.flatMap(c => c.members.map(m => m.id))).size;
  const teachers = new Set(active.flatMap(c => c.teachers.map(t => t.teacher_user_id))).size;
  const attention = active.flatMap(c => {
    const reasons: string[] = [];
    if (!c.teachers.some(t => t.role === "homeroom" && t.status === "active")) reasons.push("Belum ada wali kelas aktif");
    if (!c.teachers.some(t => t.role === "subject_teacher" && t.subject_id && t.status === "active")) reasons.push("Belum ada guru mapel aktif");
    if (!c.members.length) reasons.push("Belum ada siswa");
    return reasons.length ? [{ classroom: c, reasons }] : [];
  });
  const groups = Array.from(new Set(active.map(c => c.major || "Tanpa jurusan"))).sort().map(name => {
    const items = active.filter(c => (c.major || "Tanpa jurusan") === name);
    return {
      name, classes: items.length,
      students: new Set(items.flatMap(c => c.members.map(m => m.id))).size,
      teachers: new Set(items.flatMap(c => c.teachers.map(t => t.teacher_user_id))).size,
      ready: items.filter(c => !attention.some(a => a.classroom.id === c.id)).length,
    };
  });
  return { students, teachers, attention, groups, ready: active.length - attention.length, classCount: active.length };
}
