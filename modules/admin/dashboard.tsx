import Link from "next/link";
import { Icon } from "@/components/icon";
import { ClassList } from "@/modules/classes/class-list";
import type { Classroom } from "@/modules/classes/types";
import type { User } from "@/modules/users/types";

export function AdminDashboard({ classes, users, loginID, date }: {
  classes: Classroom[]; users: User[]; loginID: string; date: string;
}) {
  const stats = [
    { label: "Total kelas", value: classes.length, href: "/kelas", icon: "classes" as const, tone: "blue" },
    { label: "Total siswa", value: users.filter(u => u.role === "student").length, href: "/pengguna?role=student", icon: "users" as const, tone: "mint" },
    { label: "Total guru", value: users.filter(u => u.role === "teacher").length, href: "/pengguna?role=teacher", icon: "school" as const, tone: "cyan" },
    { label: "Akun aktif", value: users.filter(u => u.status === "active").length, href: "/pengguna?status=active", icon: "users" as const, tone: "blue" },
  ];
  return <>
    <div className="page-heading"><div><h1>Halaman Utama</h1><p>Selamat datang, {loginID}. Berikut ringkasan administrasi sekolah.</p></div></div>
    <p className="admin-date">{date}</p>
    <div className="admin-stats">{stats.map(stat => <Link className="stat-card" href={stat.href} key={stat.label}><div><span>{stat.label}</span><strong>{stat.value}</strong></div><span className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} /></span></Link>)}</div>
    <div className="admin-grid"><div>
      <section className="panel admin-classes"><div className="section-heading"><h2>Kelas tersedia</h2><Link className="text-link" href="/kelas">Lihat semua <Icon name="arrow" width={16} /></Link></div><ClassList items={classes.slice(0, 4)} canManage /></section>

    </div><div>
      <section className="panel"><h2 className="admin-section-title">Aktivitas terkini</h2><div className="admin-activity-note"><span className="icon-tile"><Icon name="clock" /></span><h3>Riwayat belum tersedia</h3><p>Ringkasan aktivitas akan ditampilkan setelah layanan audit aktivitas terhubung.</p></div></section>
      <section className="panel"><h2 className="admin-section-title">Kelola sekolah</h2><p className="muted">Siapkan kelas dan akun untuk kegiatan belajar.</p><div className="button-row"><Link className="button primary" href="/kelas/baru">Buat kelas baru</Link><Link className="button" href="/pengguna/baru">Tambah pengguna</Link></div></section>
      <section className="panel"><h2 className="admin-section-title">Akses cepat</h2><div className="admin-quick-links">{stats.map(stat => <Link key={stat.label} href={stat.href}><span className={`stat-icon ${stat.tone}`}><Icon name={stat.icon} /></span><span>{stat.label === "Total kelas" ? "Lihat kelas" : stat.label === "Total siswa" ? "Data siswa" : stat.label === "Total guru" ? "Data guru" : "Pengguna aktif"}</span></Link>)}</div></section>
    </div></div>
  </>;
}
