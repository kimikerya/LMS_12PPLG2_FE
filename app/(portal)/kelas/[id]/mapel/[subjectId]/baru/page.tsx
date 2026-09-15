import { notFound } from "next/navigation";
import { TeacherCreateContent } from "@/modules/teacher/content";
export const metadata={title:"Tambah Pembelajaran"};
export default async function Page({params,searchParams}:{params:Promise<{id:string;subjectId:string}>;searchParams:Promise<{jenis?:string}>}) {
 const {id,subjectId}=await params; const {jenis}=await searchParams;
 if(jenis!=="materials"&&jenis!=="assignments") notFound();
 return <TeacherCreateContent classID={id} subjectID={subjectId} kind={jenis}/>;
}
