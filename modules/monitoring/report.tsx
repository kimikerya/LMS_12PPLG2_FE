import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { monitoringClasses, monitoringContent, monitoringSubmissions } from "./data";
import { MonitoringReportTable, type ReportRow } from "./report-table";
import { date } from "@/modules/student/helpers";

export async function MonitoringReport({ classID, taskID }: { classID?: string; taskID?: string }) {
  const [classes, allTasks] = await Promise.all([monitoringClasses(), monitoringContent("assignments")]);
  const tasks = allTasks.filter(t => !classID || String(t.class_id) === classID);
  const task = taskID ? tasks.find(t => String(t.id) === taskID) : undefined;
  if (taskID && !task) notFound();
  const classroom = classes.find(c => c.id === task?.class_id);
  const submissions = task ? await monitoringSubmissions(task.id) : [];
  const memberIDs = new Set(classroom?.members.map(m => m.id) ?? []);
  const roster = [...(classroom?.members ?? []), ...submissions.filter(s => !memberIDs.has(s.student_user_id)).map(s => ({ id: s.student_user_id, full_name: `Siswa #${s.student_user_id} (di luar daftar kelas aktif)`, nis: "" }))];
  const rows: ReportRow[] = roster.map(m => { const s = submissions.find(s => s.student_user_id === m.id); return { id: m.id, name: m.full_name, nis: m.nis || "", status: s ? (s.score !== null ? "Sudah dinilai" : s.status === "late" ? "Terlambat" : "Dikumpulkan") : "Belum mengumpulkan", score: s?.score ?? null, submitted: s?.submitted_at ? date(s.submitted_at, true) : "—", released: !!s?.result_released_at }; });
  return <><div className="page-heading"><div><h1>Laporan Tugas</h1><p>Tinjau pengumpulan dan nilai per tugas. Nilai yang belum diisi tidak dihitung sebagai nol.</p></div></div><section className="panel"><form autoComplete="off" action="/laporan" method="get" className="curriculum-filters"><input type="hidden" name="mode" value="tugas"/><div className="form-field"><label htmlFor="report-class">Filter kelas</label><select id="report-class" name="kelas" defaultValue={classID || ""}><option value="">Semua kelas</option>{classes.map(c => <option value={c.id} key={c.id}>{c.title} · {c.year}</option>)}</select></div><button className="button" type="submit">Tampilkan tugas</button></form></section>
    <section className="panel"><h2>Pilih tugas</h2>{tasks.length ? <form autoComplete="off" action="/laporan" method="get" className="curriculum-filters"><input type="hidden" name="mode" value="tugas"/>{classID && <input type="hidden" name="kelas" value={classID} />}<div className="form-field"><label htmlFor="report-task">Tugas yang ditinjau</label><select name="tugas" id="report-task" defaultValue={taskID || ""} required><option value="" disabled>Pilih tugas</option>{tasks.map(t => <option key={t.id} value={t.id}>{t.title} · {classes.find(c => c.id === t.class_id)?.title || "Kelas tidak aktif"} · {t.teacher_name}</option>)}</select></div><button className="button primary" type="submit">Lihat laporan</button></form> : <EmptyState title="Belum ada tugas" description="Tugas akan muncul setelah dibuat oleh guru." />}</section>
    {task ? <><div className="section-heading"><div><h2>{task.title}</h2><p>{classroom?.title || "Kelas tidak aktif"} · {task.teacher_name} · Tenggat {date(task.due_at, true)}</p></div><Link className="text-link" href={`/tugas/${task.id}`}>Detail tugas</Link></div>{task.status === "draft" && <p className="form-message">Tugas masih berupa draf; siswa belum dapat mengumpulkan.</p>}<p className="muted">Daftar menggunakan anggota kelas saat ini dan riwayat jawaban yang tersedia.</p><MonitoringReportTable key={task.id} rows={rows} title={task.title} maxPoints={task.max_points} /></> : tasks.length > 0 && <EmptyState title="Pilih tugas untuk melihat laporan" description="Laporan memuat status pengumpulan, nilai, dan status rilis hasil kepada siswa." />}</>;
}
