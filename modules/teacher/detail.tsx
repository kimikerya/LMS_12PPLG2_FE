import { MaterialReaders } from "./material-readers";
import { ContentActions } from "./content-actions";
import { Attachments } from "@/modules/assignments/attachments";
import Link from "next/link";
import { ActionForm } from "@/components/ui/form";
import { date, learningLabels, learningPaths, safeURL } from "@/modules/student/helpers";
import { subjectHref } from "@/modules/student/subjects";
import type { Kind } from "@/modules/student/types";
import { teacherClasses, teacherDetail, teacherSubmissions } from "./data";
import { teachingStatus } from "./content";
import { publishTeachingContent } from "./actions";
import { TeacherSubmissions } from "./submissions";

export async function TeacherLearningDetail({kind,id}:{kind:Exclude<Kind,"assessments">;id:string}) {
  const item=await teacherDetail(kind,id); const classes=await teacherClasses();
  const c=classes.find(c=>c.id===item.class_id);
  const back=c&&item.subject_id?`${subjectHref(c.id,item.subject_id)}?tab=${learningPaths[kind]}`:`/${learningPaths[kind]}`;
  const submissions=kind==="assignments"?await teacherSubmissions(item.id):[];
  const url=safeURL(item.url);
  return <div className="student-workspace teacher-workspace"><Link className="text-link back-link" href={back}>← Kembali ke {learningLabels[kind].toLowerCase()}</Link><div className="page-heading"><div><span className="eyebrow">{c?.title||learningLabels[kind]}</span><h1>{item.title}</h1><p>{item.teacher_name}</p></div><span className={`badge ${item.status==="published"?"":"neutral"}`}>{teachingStatus[item.status]||item.status}</span></div><ContentActions kind={kind} id={item.id} title={item.title} back={back}/><div className="student-columns"><section className="panel"><h2>{kind==="assignments"?"Petunjuk tugas":"Informasi pembelajaran"}</h2><p className="preserve-lines">{item.description||"Belum ada keterangan."}</p><Attachments items={item.attachments} title={kind==="materials"?"File materi":"Lampiran tugas"}/>{kind==="materials"&&url&&<a className="button secondary" href={url} target="_blank" rel="noopener noreferrer">Buka sumber materi</a>}</section><section className="panel"><h2>Publikasi</h2>{kind==="assignments"&&<dl className="detail-list"><div><dt>Tenggat</dt><dd>{date(item.due_at,true)}</dd></div><div><dt>Nilai maksimal</dt><dd>{item.max_points??100}</dd></div></dl>}{item.status==="draft"?<><p className="muted">Draf belum terlihat oleh siswa. Periksa isi sebelum menerbitkan.</p><ActionForm action={publishTeachingContent.bind(null,kind,item.id)} submitLabel={`Terbitkan ${learningLabels[kind].toLowerCase()}`}><p>{c?.title}</p></ActionForm></>:<p className="muted">{item.status==="published"?"Konten sudah tersedia bagi siswa kelas ini.":"Konten sudah ditutup."}</p>}</section></div>{kind==="assignments"&&<TeacherSubmissions dueAt={item.due_at} assignmentID={item.id} items={submissions} members={c?.members??[]} maxPoints={item.max_points??100}/>} {kind==="materials"&&item.status!=="draft"&&<MaterialReaders id={item.id}/>}</div>;
}
