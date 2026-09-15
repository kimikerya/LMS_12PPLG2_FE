"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, TextField, SelectField } from "@/components/ui/form";
import { FilePicker } from "@/modules/assignments/file-picker";
import type { Content } from "@/modules/student/types";

export function MaterialForm({classID,subjectID,back,initial}:{classID:number;subjectID:number;back:string;initial?:Content}) {
 const router=useRouter(); const [files,setFiles]=useState<File[]>([]);
 const [retained,setRetained]=useState(initial?.attachments??[]);
 const [busy,setBusy]=useState(false); const [error,setError]=useState("");
 async function submit(event:FormEvent<HTMLFormElement>) {
  event.preventDefault(); if(busy)return;
  const form=new FormData(event.currentTarget);
  const url=String(form.get("url")??"").trim();
  if(!url&&!files.length&&!retained.length){setError("Unggah file materi atau isi tautan sumber terlebih dahulu.");return;}
  if(files.length+retained.length>5){setError("Maksimal 5 file, termasuk lampiran yang dipertahankan.");return;}
  const publish=(event.nativeEvent as SubmitEvent).submitter?.getAttribute("value")==="publish";
  const data=new FormData();data.set("metadata",JSON.stringify({class_id:classID,subject_id:subjectID,title:form.get("title"),description:form.get("description"),material_type:form.get("material_type"),meeting_no:form.get("meeting_no")?Number(form.get("meeting_no")):null,url:url||null,publish,retained_ids:retained.map(v=>v.id)}));
  files.forEach(file=>data.append("files",file));setBusy(true);setError("");
  try {
   const response=await fetch(initial?`/api/material-transfer/edit?material=${initial.id}`:"/api/material-transfer/create",{method:"POST",body:data});
   const result=await response.json();if(!response.ok){setError(result.error||"Materi belum tersimpan.");return;}
   setFiles([]);router.push(`/materi/${result.id}`);router.refresh();
  }catch{setError("Koneksi terputus. Isian tetap tersedia; periksa daftar materi sebelum mencoba lagi.");}finally{setBusy(false);}
 }
 return <form autoComplete="off" className="management-form" onSubmit={submit} aria-busy={busy}>
 {error&&<p role="alert" className="form-message error">{error}</p>}<fieldset disabled={busy}>
 <Field label="Judul" name="title" required maxLength={200} defaultValue={initial?.title}/>
 <TextField label="Deskripsi materi" name="description" rows={6} maxLength={20000} defaultValue={initial?.description??""}/>
 <div className="teacher-form-grid"><SelectField label="Jenis materi" name="material_type" defaultValue={initial?.type??"document"}><option value="document">Dokumen</option><option value="pdf">PDF</option><option value="link">Tautan</option><option value="video">Video</option></SelectField><Field label="Pertemuan ke" name="meeting_no" type="number" min={1} max={65535} defaultValue={initial?.meeting_no??""}/></div>
 <section className="assignment-upload-section"><h3>File dan sumber materi</h3><p className="muted">Unggah bahan pembelajaran agar siswa dapat mengunduhnya. Anda juga dapat menambahkan tautan.</p><ul className="assignment-picked-files">{retained.map(v=><li key={v.id}><span>{v.name}</span><Button onClick={()=>setRetained(items=>items.filter(item=>item.id!==v.id))}>Hapus lampiran</Button></li>)}</ul><FilePicker files={files} onChange={setFiles} label="Unggah file materi"/><Field label="Tautan materi" name="url" type="url" maxLength={500} defaultValue={initial?.url??""} hint="Isi tautan HTTP/HTTPS jika materi berada di website lain. Opsional jika sudah mengunggah file."/></section>
 <p className="muted">{initial&&initial.status!=="draft"?"Perubahan langsung terlihat oleh siswa setelah disimpan.":"Simpan draf untuk diperiksa nanti, atau langsung terbitkan kepada siswa kelas ini."}</p>
 <div className="form-actions"><ButtonLink href={back}>Batal</ButtonLink><Button type="submit" value="draft" disabled={busy}>{busy?"Menyimpan…":initial?"Simpan perubahan":"Simpan draf"}</Button>{(!initial||initial.status==="draft")&&<Button type="submit" value="publish" variant="primary" disabled={busy}>Langsung terbitkan</Button>}</div>
 </fieldset></form>;
}
