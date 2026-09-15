import Link from "next/link";
import { MonitoringReport } from "@/modules/monitoring/report";
import { ActivityPage } from "@/modules/monitoring/activity-page";
export const metadata = { title: "Laporan Aktivitas" };
export default async function Page({ searchParams }: { searchParams: Promise<{ kelas?: string; tugas?: string; mode?:string; from?:string; to?:string }> }) {
 const p=await searchParams;
 if(p.mode==="tugas"||p.tugas)return <><nav className="tabs" aria-label="Jenis laporan"><Link href="/laporan">Aktivitas & tindak lanjut</Link><Link href="/laporan?mode=tugas" className="selected">Rincian per tugas</Link></nav><MonitoringReport classID={p.kelas} taskID={p.tugas}/></>;
 return <ActivityPage from={p.from} to={p.to} classID={p.kelas}/>;
}