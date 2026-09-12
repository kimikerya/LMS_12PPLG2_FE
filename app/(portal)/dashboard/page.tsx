import Link from "next/link";
import { StudentDashboard } from "@/modules/student/dashboard";
import { AdminDashboard } from "@/modules/admin/dashboard";
import { authorizedData, requireSession } from "@/modules/auth/session";
import { roleLabels } from "@/modules/auth/types";
import type { Classroom } from "@/modules/classes/types";
import type { User } from "@/modules/users/types";
import { ClassList } from "@/modules/classes/class-list";
import { Icon } from "@/components/icon";

export const metadata = { title: "Halaman Utama" };
export default async function DashboardPage() {
  const { identity } = await requireSession();
  if (identity.role === "student") return <StudentDashboard />;
  const admin = identity.role === "admin";
  const [classes, secondary, assessments] = await Promise.all([
    authorizedData<{ data: Classroom[] }>("/api/classes"),
    admin ? authorizedData<{ data: User[] }>("/api/users") : authorizedData<{ data: { id: number }[] }>("/api/assignments?limit=100"),
    admin ? Promise.resolve({ data: [] }) : authorizedData<{ data: { id: number }[] }>("/api/assessments?limit=100"),
  ]);
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date());
  if (admin) return <AdminDashboard classes={classes.data} users={secondary.data as User[]} loginID={identity.login_id} date={date} />;
  return <><div className="page-heading"><div><span className="eyebrow">RUANG AKADEMIK ANDA</span><h1>Halaman Utama</h1><p>Ringkasan aktivitas dan akses cepat ke kebutuhan sekolah.</p></div><span className="date-label"><Icon name="clock" />{date}</span></div>
  <section className="welcome-card"><div><span className="welcome-tag">Portal {roleLabels[identity.role]}</span><h2>Selamat datang, {identity.login_id}.</h2><p>{admin ? "Kelola pengguna dan kelas dalam satu ruang kerja yang terhubung." : "Temukan kelas dan kegiatan akademik yang tersedia untuk Anda."}</p><Link className="button white" href="/kelas">Jelajahi kelas<Icon name="arrow" /></Link></div><div className="welcome-art" aria-hidden="true"><Icon name="school" width={120} height={120} /></div></section>
  <div className="stats-grid">
    <Link href="/kelas" className="stat-card"><span className="stat-icon blue"><Icon name="classes" /></span><div><span>Kelas tersedia</span><strong>{classes.data.length}</strong></div><Icon name="arrow" /></Link>
    <Link href={admin ? "/pengguna" : "/tugas"} className="stat-card"><span className="stat-icon violet"><Icon name={admin ? "users" : "task"} /></span><div><span>{admin ? "Pengguna terdaftar" : "Tugas ditampilkan"}</span><strong>{secondary.data.length}</strong></div><Icon name="arrow" /></Link>
    <Link href="/asesmen" className="stat-card"><span className="stat-icon amber"><Icon name="task" /></span><div><span>Ulangan ditampilkan</span><strong>{assessments.data.length}</strong></div><Icon name="arrow" /></Link>
  </div>
  <section className="panel"><div className="section-heading"><div><h2>Kelas Anda</h2><p>Ruang belajar yang dapat Anda akses.</p></div><Link className="text-link" href="/kelas">Lihat semua<Icon name="arrow" width={16} /></Link></div><ClassList items={classes.data.slice(0, 3)} /></section>
  <div className="dashboard-bottom"><section className="panel"><span className="eyebrow">AKSES CEPAT</span><h2>Mulai dari sini</h2><div className="quick-links"><Link href={admin ? "/pengguna" : "/materi"}><span className="icon-tile"><Icon name={admin ? "users" : "book"} /></span><span><strong>{admin ? "Manajemen pengguna" : "Materi pembelajaran"}</strong><small>{admin ? "Lihat akun berdasarkan peran" : "Temukan bahan belajar dari guru"}</small></span><Icon name="arrow" /></Link><Link href="/pengaturan"><span className="icon-tile"><Icon name="settings" /></span><span><strong>Informasi akun</strong><small>Periksa identitas dan peran Anda</small></span><Icon name="arrow" /></Link></div></section><section className="panel help-panel"><Icon name="school" width={30} height={30} /><h2>Belajar, tumbuh, bersama.</h2><p>Jika kelas atau akun belum sesuai, hubungi administrator sekolah untuk memperbarui akses Anda.</p></section></div></>;
}
