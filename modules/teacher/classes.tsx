"use client";
import Link from "next/link";
import { useState } from "react";
import { Field, SelectField } from "@/components/ui/form";
import { EmptyState } from "@/components/empty-state";
import { Icon } from "@/components/icon";
import type { ClassDetail } from "@/modules/classes/types";
import { classSubjects } from "@/modules/student/subjects";
import { initials } from "@/modules/student/helpers";

export function TeacherClasses({items,userID}:{items:ClassDetail[];userID:number}) {
  const [query,setQuery]=useState(""); const [role,setRole]=useState(""); const [year,setYear]=useState("");
  const entries=items.map(c=>({c,own:c.teachers.filter(t=>t.teacher_user_id===userID&&t.status==="active")}));
  const filtered=entries.filter(({c,own})=>(!year||c.year===year)&&(!role||own.some(t=>t.role===role))&&`${c.title} ${own.map(t=>t.subject_name).join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="student-workspace teacher-workspace"><div className="page-heading"><div><span className="eyebrow">RUANG MENGAJAR</span><h1>Kelas Ajar</h1><p>Pilih kelas untuk menyiapkan pembelajaran dan mendampingi siswa.</p></div><span className="count-pill">{items.length} kelas</span></div>
    <div className="student-filters"><Field label="Cari kelas atau mapel" type="search" placeholder="Nama kelas atau mata pelajaran…" value={query} onChange={e=>setQuery(e.target.value)}/><SelectField label="Penugasan saya" value={role} onChange={e=>setRole(e.target.value)}><option value="">Semua penugasan</option><option value="homeroom">Wali kelas</option><option value="subject_teacher">Guru mapel</option></SelectField><SelectField label="Tahun ajaran" value={year} onChange={e=>setYear(e.target.value)}><option value="">Semua tahun ajaran</option>{Array.from(new Set(items.map(c=>c.year))).map(y=><option key={y}>{y}</option>)}</SelectField></div>
    <div className="student-class-grid">{filtered.map(({c,own})=><Link className="student-class-card teacher-class-card" key={c.id} href={`/kelas/${c.id}`}><div className="student-class-top"><span className="student-class-avatar">{initials(c.title)}</span><span className={`badge ${own.some(t=>t.role==="homeroom")?"":"neutral"}`}>{own.some(t=>t.role==="homeroom")?"Wali kelas":"Guru mapel"}</span></div><h2>{c.title}</h2><p>{classSubjects({...c,teachers:own}).map(s=>s.name).join(" · ")||"Pendampingan wali kelas"}</p><small>{c.year} · {c.member_count} siswa</small><div className="student-class-footer"><span>Buka kelas</span><Icon name="arrow" width={18}/></div></Link>)}</div>
    {!filtered.length&&<section className="panel"><EmptyState icon="classes" title={items.length?"Tidak ada kelas yang cocok":"Belum ada penugasan kelas"} description={items.length?"Coba pencarian atau filter lainnya.":"Hubungi admin untuk penugasan kelas dan mata pelajaran Anda."}/></section>}
    <p className="teacher-footnote">Penambahan kelas dan perpindahan tugas diatur oleh admin sekolah.</p>
  </div>;
}
