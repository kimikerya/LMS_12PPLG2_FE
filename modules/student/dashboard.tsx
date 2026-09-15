import { AttentionPanel } from "@/modules/learning/attention";
import { studentRequestTime } from "./data";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { studentClasses, studentContent, studentProfile } from "./data";
import { classSubjects, subjectHref } from "./subjects";
import { contentHref, date, initials, closed } from "./helpers";

export async function StudentDashboard() {
 const [profile,classes,materials,tasks,assessments]=await Promise.all([studentProfile(),studentClasses(),studentContent("materials"),studentContent("assignments"),studentContent("assessments")]);
 const now=studentRequestTime(); const pending=tasks.filter(t=>!t.submission_status&&!closed(t,now));
 const upcoming=assessments.filter(a=>!a.end_at||new Date(a.end_at).getTime()>=now);
 const deadlines=pending.slice().sort((a,b)=>new Date(a.due_at!).getTime()-new Date(b.due_at!).getTime());
 const subjects=classes.flatMap(c=>classSubjects(c).map(subject=>({...subject,classroom:c})));
 const names=Object.fromEntries(classes.map(c=>[c.id,c.title]));
 const recentMaterials=materials.slice().sort((a,b)=>new Date(b.published_at??0).getTime()-new Date(a.published_at??0).getTime()).slice(0,4);
 const activity=tasks.filter(t=>t.submitted_at).sort((a,b)=>new Date(b.submitted_at!).getTime()-new Date(a.submitted_at!).getTime()).slice(0,4);
 return <div className="student-workspace"><div className="page-heading"><div><h1>Halo, {profile.full_name.split(" ")[0]}!</h1><p>Siap melanjutkan perjalanan belajar hari ini?</p></div><span className="date-label"><Icon name="clock"/>{date(new Date().toISOString())}</span></div>
 <section className="student-welcome"><div><span>Ruang belajar Anda</span><h2>Ayo belajar hal baru hari ini.</h2><p>{classes[0]?.title ?? "Penempatan kelas belum tersedia"} · {subjects.length} mata pelajaran</p><Link href="/kelas" className="button white">Buka mata pelajaran<Icon name="arrow" width={18}/></Link></div><div className="student-welcome-stats"><Link href="/tugas"><strong>{pending.length}</strong><span>Tugas menunggu</span></Link><Link href="/asesmen"><strong>{upcoming.length}</strong><span>Asesmen terjadwal</span></Link><Link href="/materi"><strong>{materials.length}</strong><span>Materi belajar</span></Link></div></section>
 <AttentionPanel/><div className="student-columns"><div><section className="panel"><div className="section-heading"><h2>Mata pelajaran saya</h2><Link className="text-link" href="/kelas">Lihat semua</Link></div>{!subjects.length?<EmptyState icon="book" title="Mata pelajaran belum tersedia" description="Hubungi admin untuk penempatan kelas dan penugasan guru mapel."/>:subjects.slice(0,3).map(s=><Link className="student-dashboard-row" href={subjectHref(s.classroom.id,s.id)} key={`${s.classroom.id}-${s.id}`}><span className="student-class-avatar small">{initials(s.name)}</span><div><h3>{s.name}</h3><p>{s.teachers.join(" · ")}</p><small>{s.classroom.title}</small></div><Icon name="arrow" width={18}/></Link>)}</section>
 <section className="panel"><div className="section-heading"><h2>Materi terbaru</h2><Link className="text-link" href="/materi">Lihat semua</Link></div>{!recentMaterials.length?<EmptyState icon="book" title="Belum ada materi" description="Materi yang diterbitkan guru akan muncul di sini."/>:recentMaterials.map(m=><Link key={m.id} href={contentHref("materials",m,m.class_id??undefined)} className="student-dashboard-row"><span className="icon-tile"><Icon name="book"/></span><div><h3>{m.title}</h3><p>{names[m.class_id??0]} · {date(m.published_at)}</p></div><Icon name="arrow" width={18}/></Link>)}</section></div>
 <aside><section className="panel"><div className="section-heading"><h2>Tenggat tugas</h2><span className="count-pill">{pending.length}</span></div>{!deadlines.length?<p className="muted">Tidak ada tugas yang menunggu dikumpulkan.</p>:<div className="student-timeline">{deadlines.slice(0,4).map(t=><Link key={t.id} href={contentHref("assignments",t,t.class_id??undefined)}><small>{date(t.due_at,true)}</small><h3>{t.title}</h3><p>{names[t.class_id??0]}</p></Link>)}</div>}</section><section className="panel"><h2>Aktivitas terakhir</h2>{!activity.length?<p className="muted">Pengumpulan tugas Anda akan tercatat di sini.</p>:<div className="student-timeline">{activity.map(t=><Link key={t.id} href={contentHref("assignments",t,t.class_id??undefined)}><small>{date(t.submitted_at,true)}</small><h3>{t.title}</h3><p>{t.submission_status==="graded"?"Nilai sudah tersedia":"Tugas berhasil dikumpulkan"}</p></Link>)}</div>}</section></aside></div>
 </div>;
}
