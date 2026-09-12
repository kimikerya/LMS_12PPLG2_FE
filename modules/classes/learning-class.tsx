import { ButtonLink } from "@/components/ui/button";
import type { ClassDetail } from "./types";

export function LearningClass({ classroom, teacher, saved }: { classroom:ClassDetail; teacher:boolean; saved:boolean }){
 return <><ButtonLink href="/kelas">Kembali ke kelas</ButtonLink>{saved&&<p className="form-message success" role="status">Kelas berhasil dibuat. Hubungi admin untuk mengatur penempatan siswa.</p>}
 <section className="panel class-detail-header"><div className="page-heading"><div><h1>{classroom.title}</h1><p>{classroom.major || classroom.level} · {classroom.year}</p></div>{teacher&&<div className="class-header-actions"><span className="badge">Aktif</span></div>}</div><div className="class-facts"><span>Tingkat<strong>Kelas {classroom.grade_level}</strong></span><span>Ruang<strong>{classroom.room || "Belum ditentukan"}</strong></span><span>Wali kelas<strong>{classroom.teachers.find(t=>t.role==="homeroom")?.full_name || "Belum ditetapkan"}</strong></span></div><p>{classroom.description}</p></section>
 <section className="panel"><h2>Guru kelas</h2>{classroom.teachers.map(t=><p key={t.id}><strong>{t.full_name}</strong> · {t.role==="homeroom"?"Wali kelas":t.subject_name||"Guru mata pelajaran"}</p>)}</section>
 {teacher&&<section className="panel table-panel"><div className="table-toolbar"><h2>Siswa kelas ({classroom.members.length})</h2></div><div className="table-scroll"><table><thead><tr><th>Nama siswa</th><th>NIS</th></tr></thead><tbody>{classroom.members.map(m=><tr key={m.id}><td>{m.full_name}</td><td>{m.nis || "—"}</td></tr>)}</tbody></table></div></section>}
 <section className="panel"><h2>Pengumuman kelas</h2>{classroom.announcements.length?classroom.announcements.map(a=><article key={a.id}><h3>{a.title}</h3><p className="preserve-lines">{a.content}</p><small>{a.author}</small></article>):<p className="muted">Belum ada pengumuman.</p>}</section>
 </>;
}
