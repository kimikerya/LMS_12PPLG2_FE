import { MonitoringLearningDetail } from "@/modules/monitoring/learning";
import { requireSession } from "@/modules/auth/session";
import { TeacherLearningDetail } from "@/modules/teacher/detail";
import { StudentLearningDetail } from "@/modules/student/detail";
export const metadata={title:"Detail Materi"};
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{kelas?:string;mapel?:string}>}) {if(["curriculum","principal"].includes((await requireSession()).identity.role))return <MonitoringLearningDetail kind="materials" id={(await params).id}/>;if((await requireSession()).identity.role==="teacher")return <TeacherLearningDetail kind="materials" id={(await params).id}/>;return <StudentLearningDetail kind="materials" id={(await params).id} context={(await searchParams).kelas} subjectContext={(await searchParams).mapel}/>;}
