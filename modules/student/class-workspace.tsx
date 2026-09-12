import Link from "next/link";
import { Icon } from "@/components/icon";
import type { ClassDetail } from "@/modules/classes/types";
import { studentContent, studentRequestTime } from "./data";
import { initials } from "./helpers";
import { StudentContentList } from "./content-list";
import { subjectHref, type ClassSubject } from "./subjects";
const tabs = [{key:"materi",label:"Materi",kind:"materials",icon:"book"},{key:"tugas",label:"Tugas",kind:"assignments",icon:"task"},{key:"asesmen",label:"Asesmen",kind:"assessments",icon:"task"}] as const;
export async function StudentClassWorkspace({classroom, subject, tab: raw}: {classroom: ClassDetail; subject: ClassSubject; tab?: string}) {
  const tab = tabs.find(t => t.key === raw) ?? tabs[0];
  const items = await studentContent(tab.kind, classroom.id, subject.id);
  return <div className="student-workspace">
    <Link className="text-link back-link" href={`/kelas?kelas=${classroom.id}`}>← {classroom.title} · Mata pelajaran</Link>
    <section className="panel student-class-header"><div className="student-class-identity"><span className="student-class-avatar">{initials(subject.name)}</span><div><span className="eyebrow">{classroom.title} · {classroom.year}</span><h1>{subject.name}</h1><p>{subject.teachers.join(" · ")}</p></div></div>
      <nav className="tabs" aria-label="Aktivitas mata pelajaran">{tabs.map(t => <Link key={t.key} href={`${subjectHref(classroom.id,subject.id)}?tab=${t.key}`} className={t.key === tab.key ? "selected" : ""} aria-current={t.key === tab.key ? "page" : undefined}><Icon name={t.icon} width={18}/>{t.label}</Link>)}</nav>
    </section>
    <StudentContentList key={tab.key} kind={tab.kind} items={items} classID={classroom.id} now={studentRequestTime()} />
  </div>;
}
