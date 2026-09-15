import { backend } from "@/lib/api";
import { teacherSession } from "./data";
import { date } from "@/modules/student/helpers";

export async function MaterialReaders({id}:{id:number}) {
 const {token}=await teacherSession();
 const {data}=await backend<{data:{id:number;name:string;nis:string|null;opened_at:string|null}[]}>(`/api/materials/${id}/readers`,{token});
 const opened=data.filter(v=>v.opened_at).length;
 return <section className="panel"><div className="section-heading"><div><h2>Pembukaan materi</h2><p className="muted">{opened} dari {data.length} siswa sudah membuka halaman materi. Catatan ini tidak memastikan seluruh isi sudah dibaca.</p></div><span className="count-pill">{opened}/{data.length}</span></div><div className="table-scroll"><table><thead><tr><th>Siswa</th><th>Status</th><th>Pertama dibuka</th></tr></thead><tbody>{data.map(v=><tr key={v.id}><td><strong>{v.name}</strong><small className="student-block muted">{v.nis}</small></td><td><span className={`badge ${v.opened_at?"":"neutral"}`}>{v.opened_at?"Sudah membuka":"Belum membuka"}</span></td><td>{v.opened_at?date(v.opened_at,true):"—"}</td></tr>)}</tbody></table></div>{!data.length&&<p className="muted">Belum ada siswa aktif di kelas ini.</p>}</section>;
}
