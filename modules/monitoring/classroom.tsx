import Link from "next/link";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { EmptyState } from "@/components/empty-state";
import type { ClassDetail } from "@/modules/classes/types";
import type { Kind } from "@/modules/student/types";
import { date } from "@/modules/student/helpers";
import { monitoringContent, monitoringSession } from "./data";
import { MonitoringContent } from "./content";

const tabs = { ringkasan: "Ringkasan", siswa: "Siswa", guru: "Guru", materi: "Materi", tugas: "Tugas", asesmen: "Asesmen", pengumuman: "Pengumuman" };
export async function MonitoringClassroom({ classroom: c, tab: raw }: { classroom: ClassDetail; tab?: string }) {
  await monitoringSession();
  const tab = Object.hasOwn(tabs, raw || "") ? raw as keyof typeof tabs : "ringkasan";
  const kind = ({ materi: "materials", tugas: "assignments", asesmen: "assessments" } as Record<string, Kind>)[tab];
  const items = kind ? await monitoringContent(kind, c.id) : [];
  return <><Link href="/kelas" className="text-link back-link">← Kembali ke monitoring kelas</Link><section className="panel class-detail-header"><div className="page-heading"><div><h1>{c.title}</h1><p>{c.major || c.level} · {c.year}</p></div><span className="badge">Aktif</span></div><div className="class-facts"><span>Wali kelas<strong>{c.teachers.find(t => t.role === "homeroom" && t.status === "active")?.full_name || "Belum ditetapkan"}</strong></span><span>Siswa<strong>{c.member_count}</strong></span><span>Guru<strong>{new Set(c.teachers.map(t => t.teacher_user_id)).size}</strong></span><span>Ruang<strong>{c.room || "Belum ditentukan"}</strong></span></div><AnimatedTabs items={Object.entries(tabs).map(([key, label]) => ({ href: `/kelas/${c.id}?tab=${key}`, label }))} selected={`/kelas/${c.id}?tab=${tab}`} label="Monitoring detail kelas" /></section>
    {tab === "ringkasan" && <div className="student-columns"><section className="panel"><h2>Tentang kelas</h2><p className="preserve-lines">{c.description || "Belum ada deskripsi kelas."}</p><div className="button-row"><Link className="button" href={`/kelas/${c.id}?tab=materi`}>Tinjau materi</Link><Link className="button" href={`/laporan?kelas=${c.id}`}>Laporan tugas kelas</Link></div></section><section className="panel"><h2>Informasi akademik</h2><dl className="detail-list"><div><dt>Tahun ajaran</dt><dd>{c.year}</dd></div><div><dt>Jenjang</dt><dd>{c.level}</dd></div><div><dt>Tingkat</dt><dd>Kelas {c.grade_level}</dd></div><div><dt>Jurusan</dt><dd>{c.major || "Tanpa jurusan"}</dd></div></dl></section></div>}
    {tab === "siswa" && <section className="panel table-panel">{c.members.length ? <div className="table-scroll"><table><thead><tr><th>Nama siswa</th><th>NIS</th><th>Status akun</th></tr></thead><tbody>{c.members.map(m => <tr key={m.id}><td>{m.full_name}</td><td>{m.nis || "—"}</td><td>{m.status === "active" ? "Aktif" : "Nonaktif"}</td></tr>)}</tbody></table></div> : <EmptyState title="Belum ada siswa" description="Penempatan siswa diatur oleh admin." />}</section>}
    {tab === "guru" && <section className="panel table-panel">{c.teachers.length ? <div className="table-scroll"><table><thead><tr><th>Nama guru</th><th>Penugasan</th><th>Mapel</th><th>Status akun</th></tr></thead><tbody>{c.teachers.map(t => <tr key={t.id}><td>{t.full_name}</td><td>{t.role === "homeroom" ? "Wali kelas" : "Guru mata pelajaran"}</td><td>{t.subject_name || "—"}</td><td>{t.status === "active" ? "Aktif" : "Nonaktif"}</td></tr>)}</tbody></table></div> : <EmptyState title="Belum ada penugasan guru" description="Penugasan wali dan guru mata pelajaran diatur oleh admin." />}</section>}
    {kind && <MonitoringContent key={kind} kind={kind} items={items} classes={[c]} />}
    {tab === "pengumuman" && <section className="panel"><h2>Pengumuman kelas</h2>{c.announcements.length ? <div className="announcement-list">{c.announcements.map(a => <article key={a.id}><small>{a.author} · {date(a.created_at, true)}</small><h3>{a.title}</h3><p className="preserve-lines">{a.content}</p></article>)}</div> : <EmptyState title="Belum ada pengumuman" description="Pengumuman dari guru atau admin akan tampil di sini." />}</section>}</>;
}
