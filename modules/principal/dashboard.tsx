import Link from "next/link";
import { redirect } from "next/navigation";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { monitoringClasses, monitoringSummary, monitoringProfile, monitoringSession } from "@/modules/monitoring/data";
import { schoolSummary } from "./summary";

export async function PrincipalDashboard() {
  const session = await monitoringSession();
  if (session.identity.role !== "principal") redirect("/dashboard");
  const [profile, classes, content] = await Promise.all([
    monitoringProfile(), monitoringClasses(), monitoringSummary(),
  ]);
  const summary = schoolSummary(classes);
  return <>
    <div className="page-heading"><div><span className="eyebrow">PORTAL KEPALA SEKOLAH</span><h1>Ringkasan Sekolah</h1><p>Selamat datang, {profile.full_name}. Tinjau kondisi akademik dan kelas yang perlu ditindaklanjuti.</p></div></div>
    <section className="welcome-card"><div><span className="welcome-tag">Pemantauan sekolah</span><h2>Kesiapan kelas dan pembelajaran.</h2><p>{summary.classCount ? `${summary.ready} dari ${summary.classCount} kelas aktif memiliki siswa, wali kelas, dan guru mapel aktif.` : "Belum ada kelas aktif untuk dipantau."}</p><Link className="button white" href="/kelas">Tinjau kelas <Icon name="arrow" /></Link></div><div className="welcome-art" aria-hidden="true"><Icon name="school" width={120} height={120} /></div></section>
    <div className="stats-grid">{[
      { label: "Kelas aktif", value: summary.classCount, icon: "classes" as const },
      { label: "Siswa dalam kelas", value: summary.students, icon: "users" as const },
      { label: "Guru ditugaskan", value: summary.teachers, icon: "school" as const },
    ].map(s => <Link href="/kelas" className="stat-card" key={s.label}><span className="stat-icon blue"><Icon name={s.icon} /></span><div><span>{s.label}</span><strong>{s.value}</strong></div><Icon name="arrow" /></Link>)}</div>
    <p className="muted school-summary-note">Ringkasan mencakup seluruh kelas aktif lintas tahun ajaran. Siswa dan guru yang berada di beberapa kelas dihitung satu kali.</p>
    <div className="student-columns"><section className="panel"><div className="section-heading"><div><h2>Publikasi pembelajaran</h2><p className="muted">Jumlah konten yang diterbitkan dari seluruh konten sekolah, termasuk kelas tidak aktif.</p></div></div>{[
      { label: "Materi", href: "/materi", items: content.materials }, { label: "Tugas", href: "/tugas", items: content.assignments }, { label: "Asesmen", href: "/asesmen", items: content.assessments },
    ].map(group => {
      const published = group.items.published;
      return <Link className="curriculum-progress" key={group.href} href={group.href}><span><strong>{group.label}</strong><small>{published} terbit / {group.items.total} total</small></span><progress value={published} max={group.items.total || 1} aria-label={`${group.label} diterbitkan`} /><small>{group.items.draft} draf</small></Link>;
    })}</section>
    <section className="panel"><h2>Perlu ditindaklanjuti</h2><p className="muted">{summary.attention.length} kelas memerlukan pemeriksaan penempatan siswa atau guru.</p>{summary.attention.length ? summary.attention.slice(0, 5).map(({ classroom, reasons }) => <Link className="student-dashboard-row" key={classroom.id} href={`/kelas/${classroom.id}?tab=${!classroom.members.length ? "siswa" : "guru"}`}><div><h3>{classroom.title}</h3><p>{reasons.join(" · ")}</p></div><Icon name="arrow" /></Link>) : <p>{classes.length ? "Penempatan siswa, wali kelas, dan guru mapel sudah tersedia pada seluruh kelas aktif." : "Kelas akan tampil setelah ditambahkan oleh admin."}</p>}<Link className="text-link" href="/kelas">Lihat seluruh kelas <Icon name="arrow" width={16} /></Link></section></div>
    <section className="panel table-panel"><div className="section-heading curriculum-filters"><div><h2>Ringkasan per jurusan</h2><p className="muted">Kelas siap berarti memiliki siswa, wali kelas aktif, dan guru mapel aktif.</p></div></div>{summary.groups.length ? <div className="table-scroll"><table><thead><tr><th>Jurusan</th><th>Kelas aktif</th><th>Siswa</th><th>Guru ditugaskan</th><th>Kelas siap</th></tr></thead><tbody>{summary.groups.map(g => <tr key={g.name}><td><strong>{g.name}</strong></td><td>{g.classes}</td><td>{g.students}</td><td>{g.teachers}</td><td>{g.ready} / {g.classes}</td></tr>)}</tbody></table></div> : <EmptyState title="Belum ada ringkasan jurusan" description="Data akan tersedia setelah kelas dibuat dan siswa/guru ditempatkan." />}</section>
    <section className="panel"><h2>Akses cepat</h2><div className="teacher-shortcuts"><Link href="/laporan"><Icon name="task" /><strong>Laporan aktivitas</strong><span>Pantau siswa/guru dan ekspor Excel.</span></Link><Link href="/kelas"><Icon name="classes" /><strong>Monitoring kelas</strong><span>Lihat siswa, guru, pengumuman, dan pembelajaran.</span></Link></div></section>
  </>;
}
