import { requireSession } from "@/modules/auth/session";
import { MonitoringProfile } from "@/modules/monitoring/profile";
import { TeacherProfile } from "@/modules/teacher/profile";
import { StudentProfile } from "@/modules/student/profile";
export const metadata={title:"Profil Saya"};
export default async function Page({searchParams}:{searchParams:Promise<{saved?:string}>}) {if(["curriculum","principal"].includes((await requireSession()).identity.role))return <MonitoringProfile saved={(await searchParams).saved==="1"}/>;if((await requireSession()).identity.role==="teacher")return <TeacherProfile saved={(await searchParams).saved==="1"}/>;return <StudentProfile saved={(await searchParams).saved==="1"}/>;}
