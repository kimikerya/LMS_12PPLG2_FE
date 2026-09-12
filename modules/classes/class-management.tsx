"use client";
import { useState } from "react";
import { ClassList } from "./class-list";
import { Field, SelectField } from "@/components/ui/form";
import type { AcademicOptions, Classroom } from "./types";
export function ClassManagement({ classes, options }: { classes: Classroom[]; options: AcademicOptions }) {
  const [search, setSearch] = useState(""); const [major, setMajor] = useState(""); const [year, setYear] = useState("");
  const filtered = classes.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) && (!major || String(c.major_id) === major) && (!year || String(c.academic_year_id) === year));
  return <><div className="management-filters"><Field label="Cari kelas" value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama kelas…" /><SelectField label="Filter jurusan" value={major} onChange={e => setMajor(e.target.value)}><option value="">Semua jurusan</option>{options.majors.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField><SelectField label="Filter tahun ajaran" value={year} onChange={e => setYear(e.target.value)}><option value="">Semua tahun ajaran</option>{options.years.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField></div><ClassList items={filtered} canManage /><p className="muted table-count">Menampilkan {filtered.length} dari {classes.length} kelas</p></>;
}
