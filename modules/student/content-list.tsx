"use client";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { Field, SelectField } from "@/components/ui/form";
import type { Content, Kind } from "./types";
import { assessmentStatus, contentHref, date, learningLabels, taskStatus } from "./helpers";

export function StudentContentList({items,kind,classID,classNames = {},now}:{items:Content[];kind:Kind;classID?:number;classNames?:Record<number,string>;now:number}) {
  const [query,setQuery] = useState(""); const [status,setStatus] = useState("");
  const stateOf = (item:Content) => kind === "assignments" ? taskStatus(item,now) : assessmentStatus(item,now);
  const statuses = Array.from(new Set(items.map(stateOf)));
  const filtered = items.filter(item => `${item.title} ${item.teacher_name} ${classNames[item.class_id ?? 0] ?? ""}`.toLowerCase().includes(query.toLowerCase()) && (!status || stateOf(item) === status));
  const groups = kind === "materials" ? Array.from(new Set(filtered.map(m=>m.meeting_no ?? 0))).sort((a,b)=>a-b) : [0];
  return <><div className="student-filters"><Field label={`Cari ${learningLabels[kind].toLowerCase()}`} placeholder="Judul atau nama guru…" value={query} onChange={e=>setQuery(e.target.value)} type="search" />{kind !== "materials" && <SelectField label="Filter status" value={status} onChange={e=>setStatus(e.target.value)}><option value="">Semua status</option>{statuses.map(s=><option key={s}>{s}</option>)}</SelectField>}</div>
    {!filtered.length ? <section className="panel"><EmptyState icon={kind === "materials" ? "book" : "task"} title={items.length ? "Tidak ada hasil yang cocok" : `Belum ada ${learningLabels[kind].toLowerCase()}`} description={items.length ? "Coba kata pencarian atau filter lain." : "Konten yang diterbitkan guru akan muncul di sini."} /></section> : groups.map(group=><section key={group} className="student-content-group">{kind === "materials" && <h2 className="eyebrow">{group ? `Pertemuan ${group}` : "Materi umum"}</h2>}<div className="student-content-rows">{filtered.filter(item=>kind!=="materials" || (item.meeting_no ?? 0)===group).map(item=><article className="student-content-row" key={item.id}>
      <span className="icon-tile"><Icon name={kind === "materials" ? "book" : "task"}/></span><div className="student-row-copy"><h3><Link href={contentHref(kind,item,classID)}>{item.title}</Link></h3><p>{item.teacher_name}{item.class_id && classNames[item.class_id] ? ` · ${classNames[item.class_id]}` : ""}</p><small>{kind === "assignments" ? `Tenggat: ${date(item.due_at,true)}` : kind === "assessments" ? `${item.question_count ?? 0} soal · ${item.duration_minutes ? `${item.duration_minutes} menit` : "Durasi belum ditentukan"} · ${date(item.start_at,true)}` : `${(item.type ?? "materi").toUpperCase()} · ${date(item.published_at)}`}</small></div>
      <div className="student-row-actions">{kind !== "materials" && <span className={`badge ${item.submission_status ? "" : "neutral"}`}>{stateOf(item)}</span>}<Link className="button secondary" href={contentHref(kind,item,classID)}>{kind === "materials" ? "Buka materi" : "Lihat detail"}<Icon name="arrow" width={16}/></Link></div>
    </article>)}</div></section>)}
  </>;
}
