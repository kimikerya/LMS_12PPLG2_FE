import { MonitoringLearningDetail } from "@/modules/monitoring/learning";
import { requireSession } from "@/modules/auth/session";
import { TeacherAssessmentPage } from "@/modules/assessments/pages";
import { StudentLearningDetail } from "@/modules/student/detail";
export const metadata={title:"Detail Asesmen"};
export default async function Page({params,searchParams}:{params:Promise<{id:string}>;searchParams:Promise<{kelas?:string;mapel?:string}>}) {if(["curriculum","principal"].includes((await requireSession()).identity.role))return <MonitoringLearningDetail kind="assessments" id={(await params).id}/>;if((await requireSession()).identity.role==="teacher")return <TeacherAssessmentPage id={(await params).id}/>;return <StudentLearningDetail kind="assessments" id={(await params).id} context={(await searchParams).kelas} subjectContext={(await searchParams).mapel}/>;}
