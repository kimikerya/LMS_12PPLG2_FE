"use client";

import { useState } from "react";
import type { ActivityReport } from "./activity-types";

type Slice = { label: string; value: number; color: string };
const number = (value: number) => value.toLocaleString("id-ID");

function Donut({title,description,unit,slices}:{title:string;description:string;unit:string;slices:Slice[]}) {
 const [selected,setSelected]=useState<string|null>(null);
 const total=slices.reduce((sum,slice)=>sum+slice.value,0);
 const active=slices.find(slice=>slice.label===selected);
 const percent=(value:number)=>total?`${(value/total*100).toLocaleString("id-ID",{maximumFractionDigits:1})}%`:"0%";
 return <section className="panel activity-donut-card" aria-label={title}>
  <h3>{title}</h3><p className="muted">{description}</p>
  <div className="activity-donut-body">
   <div className="activity-donut-visual">
    <svg viewBox="0 0 200 200" role="img" aria-label={`${title}: ${total? slices.map(slice=>`${slice.label} ${number(slice.value)} (${percent(slice.value)})`).join(", "):"Belum ada data"}`}>
     <circle cx="100" cy="100" r="78" fill="none" stroke="#edf2fa" strokeWidth="22"/>
     {total>0&&slices.map((slice,index)=>slice.value>0&&<circle key={slice.label} cx="100" cy="100" r="78" fill="none" stroke={slice.color} strokeWidth="22" pathLength="100" strokeDasharray={`${slice.value/total*100} 100`} strokeDashoffset={-slices.slice(0,index).reduce((sum,s)=>sum+s.value,0)/total*100} transform="rotate(-90 100 100)" opacity={selected&&selected!==slice.label?0.22:1}><title>{slice.label}: {number(slice.value)} ({percent(slice.value)})</title></circle>)}
    </svg>
    <div className="activity-donut-center" aria-hidden="true"><strong>{number(active?.value??total)}</strong><span>{active?percent(active.value):unit}</span></div>
   </div>
   <ul className="activity-donut-legend">{slices.map(slice=><li key={slice.label}><button type="button" aria-pressed={selected===slice.label} onClick={()=>setSelected(selected===slice.label?null:slice.label)} disabled={!total}><span className="activity-donut-dot" style={{background:slice.color}}/><span>{slice.label}<small>{number(slice.value)} {unit}</small></span><strong>{percent(slice.value)}</strong></button></li>)}</ul>
  </div>
  <p className="activity-donut-caption muted" aria-live="polite">{!total?"Belum ada data pada periode dan kelas ini.":active?`${active.label}: ${number(active.value)} dari ${number(total)} ${unit}. Tekan kategori lagi untuk melihat total.`:"Pilih kategori untuk menyorot bagiannya pada diagram."}</p>
 </section>;
}

export function ActivityDonuts({report}:{report:ActivityReport}) {
 const student=report.students.reduce((a,r)=>({tasks:a.tasks+r.tasks,submitted:a.submitted+r.submitted,late:a.late+r.late,overdue:a.overdue+r.overdue,materials:a.materials+r.materials,opened:a.opened+r.opened}),{tasks:0,submitted:0,late:0,overdue:0,materials:0,opened:0});
 const teacher=report.teachers.reduce((a,r)=>({materials:a.materials+r.materials,tasks:a.tasks+r.tasks,exams:a.exams+r.exams,graded:a.graded+r.graded,pending:a.pending+r.pending_grade}),{materials:0,tasks:0,exams:0,graded:0,pending:0});
 return <div className="activity-composition">
  <div><span className="eyebrow">PARTISIPASI SISWA</span><h2>Ringkasan aktivitas siswa</h2><p className="muted">Jumlah kewajiban per siswa di seluruh kelas dan mapel terpilih, bukan jumlah siswa unik.</p></div>
  <div className="activity-donut-grid">
   <Donut title="Status pengumpulan tugas" description="Tugas yang sudah masuk dan kewajiban yang masih belum dikumpulkan." unit="tugas" slices={[
    {label:"Masuk tepat waktu",value:Math.max(0,student.submitted-student.late),color:"#397ee8"},
    {label:"Masuk terlambat",value:student.late,color:"#a16bdb"},
    {label:"Belum masuk · lewat tenggat",value:student.overdue,color:"#df725b"},
    {label:"Belum masuk · belum lewat tenggat",value:Math.max(0,student.tasks-student.submitted-student.overdue),color:"#a9b9d0"},
   ]}/>
   <Donut title="Pembukaan materi siswa" description="Catatan membuka halaman materi. Belum tercatat bukan berarti siswa tidak belajar; pembukaan juga tidak membuktikan selesai membaca." unit="akses materi" slices={[
    {label:"Tercatat dibuka",value:student.opened,color:"#238c91"},
    {label:"Belum tercatat dibuka",value:Math.max(0,student.materials-student.opened),color:"#c7d5e8"},
   ]}/>
  </div>
  <div><span className="eyebrow">AKTIVITAS GURU</span><h2>Konten dan penilaian</h2><p className="muted">Rekap penugasan guru per kelas dan mapel. Asesmen dengan beberapa kelas tujuan dihitung pada setiap kelas.</p></div>
  <div className="activity-donut-grid">
   <Donut title="Komposisi konten guru" description="Materi dan tugas yang diterbitkan serta asesmen yang dimulai pada periode terpilih. Tidak termasuk draf atau konten yang dihapus." unit="konten" slices={[
    {label:"Materi",value:teacher.materials,color:"#238c91"},
    {label:"Tugas",value:teacher.tasks,color:"#397ee8"},
    {label:"Asesmen",value:teacher.exams,color:"#a16bdb"},
   ]}/>
   <Donut title="Progres penilaian jawaban" description="Jawaban tugas dan asesmen yang masuk. Sudah dinilai mencakup penilaian otomatis asesmen; nilai belum tentu sudah dirilis." unit="jawaban" slices={[
    {label:"Sudah dinilai",value:teacher.graded,color:"#397ee8"},
    {label:"Menunggu penilaian",value:teacher.pending,color:"#e4a53e"},
   ]}/>
  </div>
 </div>;
}
