import { ContentActions } from "@/modules/teacher/content-actions";
import { EditExamInfo } from "./edit-info";
import { notFound } from "next/navigation";
import { ApiError, backend } from "@/lib/api";
import { teacherClasses, teacherSession } from "@/modules/teacher/data";
import { classSubjects } from "@/modules/student/subjects";
import { ButtonLink } from "@/components/ui/button";
import { date } from "@/modules/student/helpers";
import { AssessmentEditor, QuestionPreview } from "./editor";
import { AssessmentManagement } from "./management";
import type { ExamDraft, ExamAttempt } from "./types";

async function loadExam(id:string,token:string){
 try{return await backend<ExamDraft>(`/api/assessments/${id}/editor`,{token});}
 catch(error){if(error instanceof ApiError&&[403,404].includes(error.status))notFound();throw error;}
}

export async function AssessmentEditorPage({id,classID,subjectID}:{id?:string;classID?:string;subjectID?:string}){
 const {token,identity}=await teacherSession();const all=await teacherClasses();
 const classes=all.filter(c=>c.status==="active").map(c=>({id:c.id,title:c.title,subjects:classSubjects({...c,teachers:c.teachers.filter(t=>t.teacher_user_id===identity.user_id)})})).filter(c=>c.subjects.length);
 if(id&&!/^[1-9]\d*$/.test(id))notFound();
 const subject=Number(subjectID)||null;const classroom=classes.find(c=>String(c.id)===classID&&c.subjects.some(s=>s.id===subject));
 const initial:ExamDraft=id?await loadExam(id,token):{title:"",subject_id:classroom?subject:null,assessment_type:"quiz",description:"",instructions:"",duration_minutes:60,start_at:null,end_at:null,class_ids:classroom?[classroom.id]:[],questions:[]};
 if(initial.has_attempts)return <EditExamInfo initial={initial}/>;
 if(!classes.length)return <div className="student-workspace"><section className="panel"><h1>Belum ada kelas ajar</h1><p>Anda perlu ditugaskan sebagai guru mata pelajaran sebelum membuat asesmen.</p><ButtonLink href="/kelas">Lihat kelas ajar</ButtonLink></section></div>;
 return <AssessmentEditor initial={initial} classes={classes} back={classroom?`/kelas/${classroom.id}/mapel/${subject}?tab=asesmen`:"/asesmen"}/>;
}
export async function TeacherAssessmentPage({id}:{id:string}){
 const {token}=await teacherSession();if(!/^[1-9]\d*$/.test(id))notFound();
 const exam=await loadExam(id,token);const classes=await teacherClasses();
 const attempts=exam.status==="draft"?[]:(await backend<{data:ExamAttempt[]}>(`/api/assessments/${id}/attempts`,{token})).data;
 return <div className="student-workspace teacher-workspace"><ButtonLink href="/asesmen">← Semua asesmen</ButtonLink><div className="page-heading"><div><span className="eyebrow">{exam.assessment_type==="quiz"?"Kuis / Ulangan harian":"Ujian daring"}</span><h1>{exam.title}</h1><p>{classes.filter(c=>exam.class_ids.includes(c.id)).map(c=>c.title).join(" · ")}</p></div><span className={`badge ${exam.status==="published"?"":"neutral"}`}>{exam.status==="draft"?"Draf":exam.status==="published"?"Diterbitkan":"Ditutup"}</span></div><ContentActions kind="assessments" id={exam.id!} title={exam.title} back="/asesmen"/><div className="student-columns"><section className="panel"><h2>Tentang asesmen</h2><p className="preserve-lines">{exam.description||"Belum ada deskripsi."}</p><h3>Petunjuk pengerjaan</h3><p className="preserve-lines">{exam.instructions||"Belum ada petunjuk tambahan."}</p></section><section className="panel"><h2>Pelaksanaan</h2><dl className="detail-list"><div><dt>Mulai</dt><dd>{date(exam.start_at,true)}</dd></div><div><dt>Selesai</dt><dd>{date(exam.end_at,true)}</dd></div><div><dt>Durasi</dt><dd>{exam.duration_minutes??"—"} menit</dd></div><div><dt>Soal & bobot</dt><dd>{exam.questions.length} soal · {Number(exam.questions.reduce((v,q)=>v+q.points,0).toFixed(2))} poin</dd></div></dl>{exam.status==="draft"&&<ButtonLink variant="primary" href={`/asesmen/${id}/edit`}>Lanjutkan penyusunan</ButtonLink>}</section></div><AssessmentManagement exam={exam} attempts={attempts}/><section className="panel"><details><summary className="text-link">Lihat soal dan kunci jawaban ({exam.questions.length})</summary><QuestionPreview questions={exam.questions} keys/></details></section></div>;
}
