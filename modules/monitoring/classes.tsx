"use client";
import Link from "next/link";
import { useState } from "react";
import { Field, SelectField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import type { ClassDetail } from "@/modules/classes/types";

export function MonitoringClasses({ items }: { items: ClassDetail[] }) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [major, setMajor] = useState("");
  const [page, setPage] = useState(0);
  const filtered = items.filter(c => (!year || c.year === year) && (!major || c.major === major) && `${c.title} ${c.teachers.map(t => t.full_name).join(" ")}`.toLowerCase().includes(query.toLowerCase().trim()));
  const pages = Math.max(1, Math.ceil(filtered.length / 15));
  return <><div className="page-heading"><div><h1>Monitoring Kelas</h1><p>Pantau siswa, penugasan guru, dan pembelajaran setiap kelas.</p></div><span className="count-pill">{items.length} kelas aktif</span></div>
    <section className="panel table-panel"><div className="curriculum-filters">
      <Field label="Cari kelas atau guru" type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="Nama kelas atau guru…" />
      <SelectField label="Tahun ajaran" value={year} onChange={e => { setYear(e.target.value); setPage(0); }}><option value="">Semua tahun ajaran</option>{Array.from(new Set(items.map(c => c.year))).map(y => <option key={y}>{y}</option>)}</SelectField>
      <SelectField label="Jurusan" value={major} onChange={e => { setMajor(e.target.value); setPage(0); }}><option value="">Semua jurusan</option>{Array.from(new Set(items.flatMap(c => c.major ? [c.major] : []))).map(m => <option key={m}>{m}</option>)}</SelectField>
      <Button onClick={() => { setQuery(""); setYear(""); setMajor(""); setPage(0); }}>Reset filter</Button>
    </div>{filtered.length ? <div className="table-scroll"><table><thead><tr><th>Kelas</th><th>Tahun ajaran</th><th>Wali kelas</th><th>Siswa</th><th>Guru</th><th>Aksi</th></tr></thead><tbody>{filtered.slice(page * 15, page * 15 + 15).map(c => <tr key={c.id}><td><strong>{c.title}</strong><br /><small>{c.major || c.level}</small></td><td>{c.year}</td><td>{c.teachers.find(t => t.role === "homeroom" && t.status === "active")?.full_name || "Belum ditetapkan"}</td><td>{c.member_count}</td><td>{new Set(c.teachers.map(t => t.teacher_user_id)).size}</td><td><Link className="text-link" href={`/kelas/${c.id}`}>Lihat kelas</Link></td></tr>)}</tbody></table></div> : <EmptyState title="Tidak ada kelas yang sesuai" description="Ubah filter atau tunggu penempatan kelas dari admin." />}
    <div className="table-footer"><span>{filtered.length} kelas · Halaman {page + 1} dari {pages}</span><div className="button-row"><Button disabled={!page} onClick={() => setPage(page - 1)}>Sebelumnya</Button><Button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Berikutnya</Button></div></div></section></>;
}
