import { teacherDetail, teacherSubmissions } from "./data";
import { MaterialForm } from "./material-form";
import { ButtonLink } from "@/components/ui/button";
import { CreateAssignmentForm } from "@/modules/assignments/create-form";

export async function EditTeachingContent({kind,id}:{kind:"materials"|"assignments";id:string}){
 const item=await teacherDetail(kind,id);const back=`/${kind==="materials"?"materi":"tugas"}/${id}`;
 const hasSubmissions=kind==="assignments"&&(await teacherSubmissions(item.id)).length>0;
 return <div className="student-workspace teacher-workspace"><ButtonLink href={back}>← Kembali</ButtonLink><div className="page-heading"><div><h1>Edit {kind==="materials"?"materi":"tugas"}</h1><p>{item.title}</p></div></div><section className="panel">{kind==="assignments"?<CreateAssignmentForm initial={item} hasSubmissions={hasSubmissions} classID={item.class_id!} subjectID={item.subject_id!} back={back}/>:<MaterialForm initial={item} classID={item.class_id!} subjectID={item.subject_id!} back={back}/>}</section></div>;
}
