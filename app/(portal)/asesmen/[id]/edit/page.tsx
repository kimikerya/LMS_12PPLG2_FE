import { AssessmentEditorPage } from "@/modules/assessments/pages";
export const metadata={title:"Edit Asesmen"};
export default async function Page({params}:{params:Promise<{id:string}>}){return <AssessmentEditorPage id={(await params).id}/>;}
