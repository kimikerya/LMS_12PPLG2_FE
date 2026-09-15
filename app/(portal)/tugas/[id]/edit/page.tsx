import { EditTeachingContent } from "@/modules/teacher/edit-content";
export default async function Page({params}:{params:Promise<{id:string}>}){const {id}=await params;return <EditTeachingContent kind="assignments" id={id}/>;}
