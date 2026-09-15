import { TeacherLearningPage } from "@/modules/teacher/content";
import { MonitoringLearningPage } from "@/modules/monitoring/learning";
import { authorizedData, requireSession } from "@/modules/auth/session";
import { StudentLearningPage } from "@/modules/student/learning-page";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { Icon } from "@/components/icon";
import { assessmentTypeLabels, learningModules, type LearningKind } from "@/config/learning";

type Content = {
  id: number; title: string; status: string; class_id: number | null;
  due_at: string | null; description: string | null; type: string | null; url: string | null;
};
const statuses: Record<string, string> = { draft: "Draft", published: "Diterbitkan", closed: "Ditutup" };

export async function LearningPage({ kind }: { kind: LearningKind }) {
  if (["curriculum", "principal"].includes((await requireSession()).identity.role)) return <MonitoringLearningPage kind={kind} />;
  if ((await requireSession()).identity.role === "teacher") return <TeacherLearningPage kind={kind} />;
  if ((await requireSession()).identity.role === "student") return <StudentLearningPage kind={kind} />;
  if ((await requireSession()).identity.role === "admin") redirect("/kelas");
  const c = learningModules[kind];
  const { data } = await authorizedData<{ data: Content[] }>(`${c.endpoint}?limit=100`);
  return <>
    <div className="page-heading">
      <div><span className="eyebrow">KEGIATAN AKADEMIK</span><h1>{c.title}</h1><p>{c.description}</p></div>
      <span className="count-pill">{data.length} ditampilkan</span>
    </div>
    {kind === "assessments" && <p className="muted">Saat ini halaman menampilkan daftar ulangan. Pengerjaan soal, timer, dan hasil ulangan belum tersedia.</p>}
    <section className="panel">
      {!data.length ? <EmptyState icon={c.icon} title={c.empty} description="Data akan muncul setelah tersedia untuk akun dan kelas Anda." /> :
        <div className="content-list">{data.map(item =>
          <article key={item.id} className="content-item">
            <span className="icon-tile"><Icon name={c.icon} /></span>
            <div>
              <h2>{item.title}</h2>
              <p>{item.description || "Belum ada deskripsi."}</p>
              <small>
                {kind === "assessments" ? assessmentTypeLabels[item.type ?? ""] ?? "Asesmen / Ulangan" : item.class_id ? `Kelas #${item.class_id}` : c.title}
                {kind === "assignments" && item.due_at ? ` · Tenggat ${new Intl.DateTimeFormat("id-ID", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Jakarta" }).format(new Date(item.due_at))} WIB` : ""}
              </small>
              {kind === "materials" && item.url && /^https?:\/\//i.test(item.url) &&
                <a className="text-link" href={item.url} target="_blank" rel="noopener noreferrer">Buka materi<Icon name="arrow" width={14} /></a>}
            </div>
            <span className={`badge ${item.status !== "published" ? "neutral" : ""}`}>{statuses[item.status] ?? item.status}</span>
          </article>
        )}</div>}
    </section>
  </>;
}
