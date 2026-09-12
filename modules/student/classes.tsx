"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { Field, SelectField } from "@/components/ui/form";
import type { ClassDetail } from "@/modules/classes/types";
import { initials } from "./helpers";
import { classSubjects, subjectHref } from "./subjects";
export function StudentClasses({ items, selectedID }: { items: ClassDetail[]; selectedID?: number }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const classroom = items.find(c => c.id === selectedID) ?? items[0];
  if (!classroom) return <div className="student-workspace"><div className="page-heading"><h1>Kelas Saya</h1></div><section className="panel"><EmptyState icon="classes" title="Anda belum ditempatkan di kelas" description="Hubungi admin sekolah untuk penempatan kelas. Mata pelajaran akan muncul setelah guru ditugaskan ke kelas Anda." /></section></div>;
  const subjects = classSubjects(classroom);
  const filtered = subjects.filter(s => `${s.name} ${s.teachers.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  const homeroom = classroom.teachers.find(t => t.role === "homeroom" && t.status === "active");
  return <div className="student-workspace">
    <section className="panel student-class-context">
      <div className="student-class-identity"><span className="student-class-avatar"><Icon name="classes" /></span><div><span className="eyebrow">KELAS SAYA</span><h1>{classroom.title}</h1><p>{classroom.major || classroom.level}</p></div><span className="badge">Aktif</span></div>
      <div className="class-facts"><span>Wali kelas<strong>{homeroom?.full_name || "Belum ditetapkan"}</strong></span><span>Tahun ajaran<strong>{classroom.year}</strong></span><span>Ruang<strong>{classroom.room || "Belum ditentukan"}</strong></span><span>Siswa<strong>{classroom.member_count} siswa</strong></span></div>
      {items.length > 1 && <SelectField label="Kelas terdaftar" value={classroom.id} onChange={e => router.push(`/kelas?kelas=${e.target.value}`)}>{items.map(c => <option key={c.id} value={c.id}>{c.title} · {c.year}</option>)}</SelectField>}
    </section>
    <div className="section-heading"><div><h2>Mata pelajaran</h2><p className="muted">Pilih mapel untuk membuka materi, tugas, dan asesmen.</p></div><span className="count-pill">{subjects.length} mapel</span></div>
    <div className="student-filters"><Field type="search" label="Cari mata pelajaran" placeholder="Nama mapel atau guru pengajar…" value={query} onChange={e => setQuery(e.target.value)} /></div>
    <div className="student-class-grid">{filtered.map(subject => <Link key={subject.id} href={subjectHref(classroom.id, subject.id)} className="student-class-card student-subject-card"><div className="student-class-top"><span className="student-class-avatar">{initials(subject.name)}</span><Icon name="book" /></div><h3>{subject.name}</h3><p>{subject.teachers.join(" · ")}</p><small>{classroom.title} · {classroom.year}</small><div className="student-class-footer"><span>Buka mapel</span><Icon name="arrow" width={18} /></div></Link>)}</div>
    {!filtered.length && <section className="panel"><EmptyState icon="book" title={subjects.length ? "Tidak ada mapel yang cocok" : "Mata pelajaran belum ditambahkan"} description={subjects.length ? "Coba nama mapel atau guru lainnya." : "Admin dapat menambahkan guru beserta mata pelajarannya melalui detail kelas."} /></section>}
    {!!classroom.announcements.length && <section className="panel student-class-notices"><h2>Pengumuman kelas</h2><div className="announcement-list">{classroom.announcements.map(a => <article key={a.id}><small>{a.author}</small><h3>{a.title}</h3><p className="preserve-lines">{a.content}</p></article>)}</div></section>}
  </div>;
}
