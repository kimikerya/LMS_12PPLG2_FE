import { StudentLearningDetail } from "@/modules/student/detail";
export const metadata={title:"Detail Asesmen"};
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{kelas?:string;mapel?:string}>}) {return <StudentLearningDetail kind="assessments" id={(await params).id} context={(await searchParams).kelas} subjectContext={(await searchParams).mapel}/>;}
