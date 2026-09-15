import { AssessmentEditorPage } from "@/modules/assessments/pages";
export const metadata={title:"Buat Asesmen"};
export default async function Page({searchParams}:{searchParams:Promise<{kelas?:string;mapel?:string}>}){const p=await searchParams;return <AssessmentEditorPage classID={p.kelas} subjectID={p.mapel}/>;}
