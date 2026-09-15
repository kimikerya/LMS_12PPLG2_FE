import Link from "next/link";
import { monitoringClasses, monitoringContent, monitoringDetail } from "./data";
import { MonitoringContent } from "./content";
import { publicationLabels } from "./labels";
import { date, learningLabels, learningPaths, safeURL } from "@/modules/student/helpers";
import type { Kind } from "@/modules/student/types";

export async function MonitoringLearningPage({ kind }: { kind: Kind }) {
  const [items, classes] = await Promise.all([monitoringContent(kind), monitoringClasses()]);
  return <><div className="page-heading"><div><h1>Monitoring {learningLabels[kind]}</h1><p>Tinjau konten dan status publikasi guru di seluruh sekolah.</p></div><span className="count-pill">{items.length} konten</span></div><MonitoringContent items={items} classes={classes} kind={kind} /></>;
}
export async function MonitoringLearningDetail({ kind, id }: { kind: Kind; id: string }) {
  const [item, classes] = await Promise.all([monitoringDetail(kind, id), monitoringClasses()]);
  const classroom = classes.find(c => c.id === item.class_id);
  const url = safeURL(item.url);
  return <><Link className="text-link back-link" href={`/${learningPaths[kind]}`}>← Kembali ke monitoring {learningLabels[kind].toLowerCase()}</Link><div className="page-heading"><div><span className="eyebrow">{classroom?.title || learningLabels[kind]}</span><h1>{item.title}</h1><p>{item.teacher_name}</p></div><span className={`badge ${item.status === "published" ? "" : "neutral"}`}>{publicationLabels[item.status] || item.status}</span></div>
    <div className="student-columns"><section className="panel"><h2>Isi {learningLabels[kind].toLowerCase()}</h2><p className="preserve-lines">{item.description || "Belum ada keterangan."}</p>{item.instructions && <p className="preserve-lines">{item.instructions}</p>}{url && <a className="button" href={url} target="_blank" rel="noopener noreferrer">Buka sumber materi</a>}</section><section className="panel"><h2>Informasi pembelajaran</h2><dl className="detail-list"><div><dt>Guru</dt><dd>{item.teacher_name}</dd></div>{classroom && <div><dt>Kelas</dt><dd><Link className="text-link" href={`/kelas/${classroom.id}`}>{classroom.title}</Link></dd></div>}{kind === "assignments" && <><div><dt>Tenggat</dt><dd>{date(item.due_at, true)}</dd></div><div><dt>Nilai maksimal</dt><dd>{item.max_points ?? "—"}</dd></div></>}{kind === "assessments" && <><div><dt>Mulai</dt><dd>{date(item.start_at, true)}</dd></div><div><dt>Selesai</dt><dd>{date(item.end_at, true)}</dd></div><div><dt>Jumlah soal</dt><dd>{item.question_count ?? 0}</dd></div><div><dt>Durasi</dt><dd>{item.duration_minutes ? `${item.duration_minutes} menit` : "Belum ditentukan"}</dd></div></>}</dl>{kind === "assignments" && <Link className="button primary" href={`/laporan?tugas=${item.id}`}>Lihat laporan tugas</Link>}</section></div></>;
}
