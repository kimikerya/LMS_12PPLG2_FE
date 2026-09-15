import { CreateAssignmentForm } from "@/modules/assignments/create-form";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { MaterialForm } from "./material-form";
import { EmptyState } from "@/components/empty-state";
import { date, learningLabels, learningPaths } from "@/modules/student/helpers";
import { subjectHref } from "@/modules/student/subjects";
import type { Kind, Content } from "@/modules/student/types";
import { teacherClasses, teacherContent, teacherSubject } from "./data";


export const teachingStatus:Record<string,string>={draft:"Draf",published:"Diterbitkan",closed:"Ditutup"};
export function TeacherContentRows({items,kind,classNames={},subjectNames={}}:{items:Content[];kind:Kind;classNames?:Record<number,string>;subjectNames?:Record<number,string>}) {
  return <section className="panel">{!items.length?<EmptyState icon={kind==="materials"?"book":"task"} title={`Belum ada ${learningLabels[kind].toLowerCase()}`} description={kind==="assessments"?"Asesmen yang ditugaskan akan ditampilkan di sini.":"Siapkan konten dari salah satu mapel di Kelas Ajar."}/>:<div className="teacher-content-list">{items.map(item=><Link key={item.id} href={`/${learningPaths[kind]}/${item.id}`} className="teacher-content-item"><div><h3>{item.title}</h3><p>{subjectNames[item.subject_id??0]&&`${subjectNames[item.subject_id??0]} · `}{classNames[item.class_id??0]||learningLabels[kind]}{item.due_at?` · Tenggat ${date(item.due_at,true)}`:""}</p></div><span className={`badge ${item.status==="published"?"":"neutral"}`}>{teachingStatus[item.status]||item.status}</span><span className="text-link">{kind==="assignments"?"Periksa tugas":"Buka detail"} →</span></Link>)}</div>}</section>;
}
export async function TeacherLearningPage({kind}:{kind:Kind}) {
  const [items,classes]=await Promise.all([teacherContent(kind),teacherClasses()]);
  return <div className="student-workspace teacher-workspace"><div className="page-heading"><div><h1>{learningLabels[kind]} Saya</h1><p>Konten Anda dari seluruh kelas ajar.</p></div><ButtonLink variant="primary" href={kind==="assessments"?"/asesmen/baru":"/kelas"}>{kind==="assessments"?"+ Buat asesmen":"Buka kelas ajar"}</ButtonLink></div><TeacherContentRows items={items} kind={kind} classNames={Object.fromEntries(classes.map(c=>[c.id,c.title]))} subjectNames={Object.fromEntries(classes.flatMap(c=>c.teachers.filter(t=>t.subject_id).map(t=>[t.subject_id,t.subject_name??"Mata pelajaran"])))}/></div>;
}
export async function TeacherSubjectPage({classID,subjectID,tab}:{classID:string;subjectID:string;tab?:string}) {
  const {classroom,subject}=await teacherSubject(classID,subjectID);
  const kind:Kind=tab==="tugas"?"assignments":tab==="asesmen"?"assessments":"materials";
  const items=await teacherContent(kind,classroom.id,subject.id);
  const path=subjectHref(classroom.id,subject.id);
  return <div className="student-workspace teacher-workspace"><Link className="text-link back-link" href={`/kelas/${classID}`}>← {classroom.title}</Link><section className="panel student-class-header"><div className="page-heading"><div><span className="eyebrow">{classroom.title} · {classroom.year}</span><h1>{subject.name}</h1><p>Ruang pembelajaran yang Anda ampu.</p></div><ButtonLink variant="primary" href={kind==="assessments"?`/asesmen/baru?kelas=${classID}&mapel=${subjectID}`:`${path}/baru?jenis=${kind}`}>Tambah {learningLabels[kind].toLowerCase()}</ButtonLink></div><nav className="tabs" aria-label="Aktivitas mapel guru">{(["materials","assignments","assessments"] as Kind[]).map(k=><Link key={k} href={`${path}?tab=${learningPaths[k]}`} className={kind===k?"selected":""} aria-current={kind===k?"page":undefined}>{learningLabels[k]}</Link>)}</nav></section><TeacherContentRows items={items} kind={kind} classNames={{[classroom.id]:classroom.title}} subjectNames={{[subject.id]:subject.name}}/></div>;
}
export async function TeacherCreateContent({classID,subjectID,kind}:{classID:string;subjectID:string;kind:"materials"|"assignments"}) {
  const {classroom,subject}=await teacherSubject(classID,subjectID);
  const back=`${subjectHref(classroom.id,subject.id)}?tab=${learningPaths[kind]}`;
  return <div className="student-workspace teacher-workspace"><Link className="text-link back-link" href={back}>← {subject.name}</Link><div className="page-heading"><div><h1>Tambah {learningLabels[kind].toLowerCase()}</h1><p>{classroom.title} · {subject.name}</p></div><span className="badge neutral">Draf</span></div><section className="panel">{kind==="assignments"?<CreateAssignmentForm classID={classroom.id} subjectID={subject.id} back={back}/>:<MaterialForm classID={classroom.id} subjectID={subject.id} back={back}/>}</section></div>;
}
