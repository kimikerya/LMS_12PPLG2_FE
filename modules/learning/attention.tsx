import Link from "next/link";
import { backend } from "@/lib/api";
import { requireSession } from "@/modules/auth/session";
import { date } from "@/modules/student/helpers";

type AttentionItem = {
  id: number;
  kind: "assignments" | "assessments";
  status: "closed" | "overdue" | "due" | "ongoing" | "scheduled" | "grading";
  title: string;
  class_name: string;
  subject: string;
  at: string;
  count: number;
};

const labels: Record<AttentionItem["status"], string> = {
  closed: "Lewat tenggat · pengumpulan ditutup",
  overdue: "Terlambat · masih menerima jawaban",
  due: "Tugas mendekati tenggat",
  ongoing: "Asesmen sedang berlangsung",
  scheduled: "Asesmen akan dimulai",
  grading: "Menunggu pemeriksaan guru",
};

export async function AttentionPanel() {
  const { token, identity } = await requireSession();
  if (!["student", "teacher"].includes(identity.role)) return null;

  let items: AttentionItem[];
  try {
    const response = await backend<{ data: AttentionItem[] }>("/api/learning/attention", { token });
    items = response.data;
  } catch {
    return <section className="panel"><h2>Perlu perhatian</h2><p className="muted" role="status">Ringkasan belum dapat dimuat. Anda tetap bisa membuka daftar tugas dan asesmen.</p><div className="form-actions"><Link className="button" href="/tugas">Lihat tugas</Link><Link className="button" href="/asesmen">Lihat asesmen</Link></div></section>;
  }

  return <section className="panel attention-panel" aria-label="Perlu perhatian">
    <div className="section-heading"><div><h2>Perlu perhatian</h2><p className="muted">Tenggat dan jadwal 7 hari ke depan{identity.role === "student" ? ", termasuk tugas lewat tenggat yang belum dikumpulkan." : ", serta jawaban yang perlu diperiksa."}</p></div><span className="count-pill">{items.length} pengingat</span></div>
    {items.length ? <ul className="attention-list">{items.map(item => <li key={`${item.kind}/${item.id}/${item.status}`}>
      <div><span className="badge neutral">{labels[item.status]}</span><h3>{item.title}</h3><p>{item.subject} · {item.class_name}</p><small>{item.status === "grading" ? `${item.count} jawaban · terlama dikumpulkan ` : item.kind === "assignments" ? "Tenggat " : "Mulai "}{date(item.at, true)}</small></div>
      <Link className="button" href={`/${item.kind === "assignments" ? "tugas" : "asesmen"}/${item.id}`}>{item.status === "grading" ? "Periksa jawaban" : item.kind === "assignments" ? "Buka tugas" : "Buka asesmen"}</Link>
    </li>)}</ul> : <p className="muted">Belum ada hal yang perlu ditindaklanjuti pada ringkasan ini. Jadwal lain tetap tersedia di halaman tugas dan asesmen.</p>}
    {items.length === 5 && <p className="muted">Menampilkan 5 pengingat prioritas. Buka daftar tugas atau asesmen untuk melihat seluruhnya.</p>}
  </section>;
}
