import Link from "next/link";
import { redirect } from "next/navigation";
import { requireSession } from "@/modules/auth/session";
import { DeleteControl } from "@/components/ui/delete-control";
import { deleteClass } from "@/modules/classes/actions";
import { LearningClass } from "@/modules/classes/learning-class";
import { backend } from "@/lib/api";
import { ButtonLink } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { ClassStudents, ClassTeachers, AnnouncementControl } from "@/modules/classes/member-controls";
import { classDetail } from "@/modules/classes/data";
import type { AcademicOptions } from "@/modules/classes/types";
import type { User } from "@/modules/users/types";
export const metadata = { title: "Detail Kelas" };
const tabs = { ringkasan: "Ringkasan", siswa: "Siswa", guru: "Guru", pengumuman: "Pengumuman" };
export default async function ClassDetailPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ tab?: string; saved?: string; user_saved?: string; joined?: string }> }) {
  const session = await requireSession(); const { id } = await params; const { tab: raw, saved, user_saved } = await searchParams;
  const tab = Object.hasOwn(tabs, raw ?? "") ? raw as keyof typeof tabs : "ringkasan";
  const classroom = await classDetail(id, session.token);
  if (session.identity.role === "student") redirect(`/kelas?kelas=${classroom.id}`);
  const teacher = session.identity.role === "teacher";
  if (session.identity.role !== "admin") return <LearningClass classroom={classroom} teacher={teacher} saved={saved === "1"} />;
  const [users, options] = await Promise.all([
    tab === "siswa" || tab === "guru" ? backend<{ data: User[] }>(`/api/users?role=${tab === "siswa" ? "student" : "teacher"}`, { token: session.token }) : Promise.resolve({ data: [] }),
    tab === "guru" ? backend<AcademicOptions>("/api/academic-options", { token: session.token }) : Promise.resolve(null),
  ]);
  const homeroom = classroom.teachers.find(t => t.role === "homeroom"); const teacherCount = new Set(classroom.teachers.map(t => t.teacher_user_id)).size;
  return <><Link className="text-link back-link" href="/kelas">Kembali ke daftar kelas</Link>{saved === "1" && <p className="form-message success" role="status">Data kelas berhasil disimpan. Atur keanggotaan melalui tab Siswa dan Guru.</p>}
    {user_saved === "1" && <p className="form-message success" role="status">Perubahan data pengguna berhasil disimpan.</p>}
    <section className="panel class-detail-header"><div className="page-heading"><div><h1>{classroom.title}</h1><p>{classroom.major || classroom.level} · {classroom.year}</p></div><div className="class-header-actions"><span className="badge">Aktif</span><ButtonLink href={`/kelas/${id}/edit`}>Edit kelas</ButtonLink><DeleteControl kind="kelas" name={classroom.title} detail={`${classroom.year} - Kelas ${classroom.grade_level}`} action={deleteClass.bind(null,classroom.id)} /></div></div><div className="class-facts"><span>Wali kelas<strong>{homeroom?.full_name ?? "Belum ditetapkan"}</strong></span><span>Siswa<strong>{classroom.members.length}</strong></span><span>Guru<strong>{teacherCount}</strong></span><span>Ruang<strong>{classroom.room || "Belum ditentukan"}</strong></span></div><nav className="tabs" aria-label="Detail kelas">{Object.entries(tabs).map(([value, label]) => <Link key={value} href={`/kelas/${id}?tab=${value}`} className={tab === value ? "selected" : ""} aria-current={tab === value ? "page" : undefined}>{label}</Link>)}</nav></section>
    {tab === "ringkasan" && <div className="form-layout"><div><div className="summary-cards"><div className="panel"><span>Siswa terdaftar</span><strong>{classroom.members.length}</strong></div><div className="panel"><span>Guru kelas</span><strong>{teacherCount}</strong></div><div className="panel"><span>Pengumuman</span><strong>{classroom.announcements.length}</strong></div></div><section className="panel"><h2>Tentang kelas</h2><p className="preserve-lines">{classroom.description || "Belum ada deskripsi kelas."}</p><div className="button-row"><ButtonLink href={`/kelas/${id}?tab=siswa`}>Kelola siswa</ButtonLink><ButtonLink href={`/kelas/${id}?tab=guru`}>Kelola guru</ButtonLink></div></section></div><section className="panel"><h2>Informasi kelas</h2><dl className="detail-list"><div><dt>Tahun ajaran</dt><dd>{classroom.year}</dd></div><div><dt>Jenjang</dt><dd>{classroom.level}</dd></div><div><dt>Jurusan</dt><dd>{classroom.major || "Tanpa jurusan"}</dd></div><div><dt>Tingkat</dt><dd>Kelas {classroom.grade_level}</dd></div><div><dt>Ruang</dt><dd>{classroom.room || "Belum ditentukan"}</dd></div></dl></section></div>}
    {tab === "siswa" && <ClassStudents classID={classroom.id} members={classroom.members} candidates={users.data} />}
    {tab === "guru" && options && <ClassTeachers classID={classroom.id} teachers={classroom.teachers} candidates={users.data} options={options} />}
    {tab === "pengumuman" && <section className="panel"><div className="section-heading"><h2>Pengumuman Kelas</h2><AnnouncementControl classID={classroom.id} /></div>{classroom.announcements.length ? <div className="announcement-list">{classroom.announcements.map(a => <article key={a.id}><div className="table-person"><span className="avatar">{a.author.slice(0, 2).toUpperCase()}</span><div><strong>{a.author}</strong><small>{new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(a.created_at))} WIB</small></div></div><h3>{a.title}</h3><p className="preserve-lines">{a.content}</p></article>)}</div> : <EmptyState title="Belum ada pengumuman" description="Terbitkan informasi pertama untuk kelas ini." />}</section>}
  </>;
}
