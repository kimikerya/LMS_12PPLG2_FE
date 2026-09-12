import { StudentProfile } from "@/modules/student/profile";
export const metadata={title:"Profil Saya"};
export default async function Page({searchParams}:{searchParams:Promise<{saved?:string}>}) {return <StudentProfile saved={(await searchParams).saved==="1"}/>;}
