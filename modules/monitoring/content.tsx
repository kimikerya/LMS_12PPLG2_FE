"use client";
import Link from "next/link";
import { useState } from "react";
import { Field, SelectField } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import type { Content, Kind } from "@/modules/student/types";
import { date, learningPaths } from "@/modules/student/helpers";
import type { ClassDetail } from "@/modules/classes/types";

import { publicationLabels } from "./labels";
export function MonitoringContent({ items, kind, classes }: { items: Content[]; kind: Kind; classes: ClassDetail[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [subject, setSubject] = useState("");
  const [page, setPage] = useState(0);
  const subjects = Array.from(new Map(classes.flatMap(c => c.teachers.flatMap(t => t.subject_id ? [[t.subject_id, t.subject_name || `Mapel #${t.subject_id}`] as const] : []))).entries());
  const subjectName = (id: number | null) => subjects.find(s => s[0] === id)?.[1] || (id ? `Mapel #${id}` : "Umum");
  const filtered = items.filter(i => (!status || i.status === status) && (!subject || String(i.subject_id) === subject) && `${i.title} ${i.teacher_name} ${subjectName(i.subject_id)} ${classes.find(c => c.id === i.class_id)?.title || ""}`.toLowerCase().includes(query.trim().toLowerCase()));
  const pages = Math.max(1, Math.ceil(filtered.length / 15));
  return <section className="panel table-panel"><div className="curriculum-filters"><Field label="Cari pembelajaran" type="search" value={query} onChange={e => { setQuery(e.target.value); setPage(0); }} placeholder="Judul, guru, atau kelas…" /><SelectField label="Status publikasi" value={status} onChange={e => { setStatus(e.target.value); setPage(0); }}><option value="">Semua status</option>{Object.entries(publicationLabels).map(([v, label]) => <option value={v} key={v}>{label}</option>)}</SelectField><SelectField label="Mata pelajaran" value={subject} onChange={e => { setSubject(e.target.value); setPage(0); }}><option value="">Semua mapel</option>{subjects.map(([id, name]) => <option value={id} key={id}>{name}</option>)}</SelectField><Button onClick={() => { setQuery(""); setStatus(""); setSubject(""); setPage(0); }}>Reset filter</Button></div>
    {filtered.length ? <div className="table-scroll"><table><thead><tr><th>Judul</th><th>Guru</th><th>Mapel</th>{kind !== "assessments" && <th>Kelas</th>}<th>Status</th><th>{kind === "assignments" ? "Tenggat" : kind === "assessments" ? "Mulai" : "Diterbitkan"}</th><th>Aksi</th></tr></thead><tbody>{filtered.slice(page * 15, page * 15 + 15).map(i => <tr key={i.id}><td><strong>{i.title}</strong></td><td>{i.teacher_name}</td><td>{subjectName(i.subject_id)}</td>{kind !== "assessments" && <td>{classes.find(c => c.id === i.class_id)?.title || "Kelas tidak aktif"}</td>}<td><span className={`badge ${i.status === "published" ? "" : "neutral"}`}>{publicationLabels[i.status] || i.status}</span></td><td>{date(kind === "assignments" ? i.due_at : kind === "assessments" ? i.start_at : i.published_at)}</td><td><Link className="text-link" href={`/${learningPaths[kind]}/${i.id}`}>Lihat detail</Link></td></tr>)}</tbody></table></div> : <EmptyState title="Belum ada pembelajaran yang sesuai" description="Konten guru akan muncul di sini. Coba ubah pencarian atau filter." />}
    <div className="table-footer"><span>{filtered.length} konten · Halaman {page + 1} dari {pages}</span><div className="button-row"><Button disabled={!page} onClick={() => setPage(page - 1)}>Sebelumnya</Button><Button disabled={page + 1 >= pages} onClick={() => setPage(page + 1)}>Berikutnya</Button></div></div></section>;
}
