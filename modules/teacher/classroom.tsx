import Link from "next/link";
import { teacherSession } from "./data";
import type { ClassDetail } from "@/modules/classes/types";
import { classSubjects, subjectHref } from "@/modules/student/subjects";
import { initials, date } from "@/modules/student/helpers";
import { EmptyState } from "@/components/empty-state";

export async function TeacherClassroom({classroom:c,tab:raw}:{classroom:ClassDetail;tab?:string}) {
  const {identity}=await teacherSession();
  const own=c.teachers.filter(t=>t.teacher_user_id===identity.user_id&&t.status==="active");
  const homeroom=own.some(t=>t.role==="homeroom");
  const subjects=classSubjects({...c,teachers:own});
  const tab=raw==="siswa"||raw==="pengumuman"?raw:"mapel";
  return <div className="student-workspace teacher-workspace"><Link className="text-link back-link" href="/kelas">← Kelas Ajar</Link><section className="panel student-class-header"><div className="page-heading"><div><span className="eyebrow">{c.year} · {c.major||c.level}</span><h1>{c.title}</h1><p>{c.member_count} siswa · {c.room||"Ruang belum ditetapkan"}</p></div><span className={`badge ${homeroom?"":"neutral"}`}>{homeroom?"Wali kelas":"Guru mapel"}</span></div>{homeroom&&<p className="teacher-homeroom-note">Anda mendampingi kelas ini sebagai wali kelas{subjects.length?" dan mengampu mapel di bawah ini":""}. Daftar siswa dan informasi kelas tersedia melalui tab berikut.</p>}<nav className="tabs" aria-label="Kelas ajar">{[["mapel","Mapel saya"],["siswa","Siswa"],["pengumuman","Pengumuman"]].map(([key,label])=><Link key={key} href={`/kelas/${c.id}?tab=${key}`} className={tab===key?"selected":""} aria-current={tab===key?"page":undefined}>{label}</Link>)}</nav></section>
  {tab==="mapel"&&<><div className="student-class-grid">{subjects.map(s=><Link key={s.id} href={subjectHref(c.id,s.id)} className="student-class-card"><span className="student-class-avatar">{initials(s.name)}</span><h2 className="teacher-subject-title">{s.name}</h2><p>Materi, tugas, dan hasil pengumpulan siswa.</p><div className="student-class-footer">Kelola pembelajaran <span>→</span></div></Link>)}</div>{!subjects.length&&<section className="panel"><EmptyState icon="book" title="Belum ada mapel yang Anda ampu" description="Penugasan wali kelas tidak otomatis menjadi penugasan mapel. Hubungi admin jika Anda juga mengajar mata pelajaran di kelas ini."/></section>}{homeroom&&<section className="panel teacher-class-overview"><h2>Guru pengajar kelas</h2>{classSubjects(c).map(s=><div className="teacher-content-item" key={s.id}><strong>{s.name}</strong><span className="muted">{s.teachers.join(" · ")}</span></div>)}</section>}</>}
  {tab==="siswa"&&<section className="panel table-panel"><div className="table-toolbar"><h2>Siswa kelas ({c.members.length})</h2></div>{c.members.length?<div className="table-scroll"><table><thead><tr><th>Nama siswa</th><th>NIS</th><th>Status akun</th></tr></thead><tbody>{c.members.map(m=><tr key={m.id}><td>{m.full_name}</td><td>{m.nis||"—"}</td><td>{m.status==="active"?"Aktif":"Nonaktif"}</td></tr>)}</tbody></table></div>:<EmptyState title="Belum ada siswa" description="Penempatan siswa dikelola admin sekolah."/>}</section>}
  {tab==="pengumuman"&&<section className="panel"><h2>Pengumuman kelas</h2>{c.announcements.length?<div className="announcement-list">{c.announcements.map(a=><article key={a.id}><small>{a.author} · {date(a.created_at,true)}</small><h3>{a.title}</h3><p className="preserve-lines">{a.content}</p></article>)}</div>:<EmptyState title="Belum ada pengumuman" description="Informasi kelas yang diterbitkan sekolah akan muncul di sini."/>}</section>}
  </div>;
}
