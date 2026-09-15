import { studentDetail } from "@/modules/student/data";
import { ExamRunner } from "@/modules/assessments/runner";
export const metadata={title:"Kerjakan Asesmen"};
export default async function Page({params}:{params:Promise<{id:string}>}){const item=await studentDetail("assessments",(await params).id);return <ExamRunner id={item.id} title={item.title} instructions={item.instructions} duration={item.duration_minutes}/>;}
