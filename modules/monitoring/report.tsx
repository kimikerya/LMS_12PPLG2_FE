import Link from "next/link";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { monitoringClasses, monitoringContent, monitoringSubmissions } from "./data";
import { MonitoringReportTable, type ReportRow } from "./report-table";
import { date } from "@/modules/student/helpers";

export async function MonitoringReport({ classID, taskID }: { classID?: string; taskID?: string }) {
  const [classes, allTasks] = await Promise.all([monitoringClasses(), monitoringContent("assignments")]);
  const requestedTask = taskID ? allTasks.find(t => String(t.id) === taskID) : undefined;
  if (taskID && !requestedTask) notFound();
  // A direct link to a task should also make its class visible in the filter.
  const requestedTaskClassID = requestedTask?.class_id ?? 0;
  const activeClassID = classID || (requestedTaskClassID ? String(requestedTaskClassID) : "");
  const tasks = allTasks.filter(t => !activeClassID || String(t.class_id) === activeClassID);
  const task = requestedTask && (!activeClassID || String(requestedTask.class_id) === activeClassID) ? requestedTask : undefined;
  const classroom = classes.find(c => c.id === task?.class_id);
  const taskClassIsMissing = Boolean(requestedTaskClassID && !classes.some(c => c.id === requestedTaskClassID));
  const submissions = task ? await monitoringSubmissions(task.id) : [];
  const memberIDs = new Set(classroom?.members.map(m => m.id) ?? []);
  const roster = [...(classroom?.members ?? []), ...submissions.filter(s => !memberIDs.has(s.student_user_id)).map(s => ({ id: s.student_user_id, full_name: `Siswa #${s.student_user_id} (di luar daftar kelas aktif)`, nis: "" }))];
  const rows: ReportRow[] = roster.map(m => { const s = submissions.find(s => s.student_user_id === m.id); return { id: m.id, name: m.full_name, nis: m.nis || "", status: s ? (s.score !== null ? "Sudah dinilai" : s.status === "late" ? "Terlambat" : "Dikumpulkan") : "Belum mengumpulkan", score: s?.score ?? null, submitted: s?.submitted_at ? date(s.submitted_at, true) : "—", released: !!s?.result_released_at }; });
  return <><div className="page-heading"><div><h1>Laporan Tugas</h1><p>Tinjau pengumpulan dan nilai per tugas. Nilai yang belum diisi tidak dihitung sebagai nol.</p></div></div><section className="panel report-filter-panel"><div className="section-heading"><div><h2>Filter laporan</h2><p className="muted">Pilih kelas untuk memuat daftar tugas yang tersedia.</p></div></div><form autoComplete="off" action="/laporan" method="get" className="curriculum-filters"><input type="hidden" name="mode" value="tugas"/><div className="form-field"><label htmlFor="report-class">Filter kelas</label><select id="report-class" name="kelas" defaultValue={activeClassID}><option value="">Semua kelas</option>{classes.map(c => <option value={c.id} key={c.id}>{c.title} · {c.year}</option>)}{taskClassIsMissing && requestedTaskClassID > 0 && <option value={requestedTaskClassID}>Kelas tugas (tidak aktif)</option>}</select></div><button className="button" type="submit">Tampilkan tugas</button></form><div className="report-filter-divider" />{tasks.length ? <form autoComplete="off" action="/laporan" method="get" className="curriculum-filters"><input type="hidden" name="mode" value="tugas"/>{activeClassID && <input type="hidden" name="kelas" value={activeClassID} />}<div className="form-field"><label htmlFor="report-task">Tugas yang ditinjau</label><select name="tugas" id="report-task" defaultValue={taskID || ""} required><option value="" disabled>Pilih tugas</option>{tasks.map(t => <option key={t.id} value={t.id}>{t.title} · {classes.find(c => c.id === t.class_id)?.title || "Kelas tidak aktif"} · {t.teacher_name}</option>)}</select></div><button className="button primary" type="submit">Lihat laporan</button></form> : <EmptyState title="Belum ada tugas" description="Tugas akan muncul setelah dibuat oleh guru." />}</section>
    {task ? <><div className="section-heading"><div><h2>{task.title}</h2><p>{classroom?.title || "Kelas tidak aktif"} · {task.teacher_name} · Tenggat {date(task.due_at, true)}</p></div><Link className="text-link" href={`/tugas/${task.id}`}>Detail tugas</Link></div>{task.status === "draft" && <p className="form-message">Tugas masih berupa draf; siswa belum dapat mengumpulkan.</p>}<p className="muted">Daftar menggunakan anggota kelas saat ini dan riwayat jawaban yang tersedia.</p><MonitoringReportTable key={task.id} rows={rows} title={task.title} maxPoints={task.max_points} /></> : tasks.length > 0 && <EmptyState title="Pilih tugas untuk melihat laporan" description="Laporan memuat status pengumpulan, nilai, dan status rilis hasil kepada siswa." />}</>;
}
