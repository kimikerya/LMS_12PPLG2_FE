"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Field, TextField } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { saveAssessment } from "./actions";
import type { ExamDraft } from "./types";
export function EditExamInfo({initial}:{initial:ExamDraft}){
 const [draft,setDraft]=useState(initial),[busy,setBusy]=useState(false),[error,setError]=useState("");const router=useRouter();
 async function submit(e:FormEvent){e.preventDefault();setBusy(true);setError("");try{const result=await saveAssessment(initial.id,draft);if(result.error){setError(result.error);return;}router.push(`/asesmen/${initial.id}`);router.refresh();}catch{setError("Perubahan belum tersimpan. Periksa koneksi lalu coba lagi.");}finally{setBusy(false);}}
 return <div className="student-workspace teacher-workspace"><h1>Edit asesmen</h1><p className="form-message">Sudah ada siswa yang mulai mengerjakan. Judul, deskripsi, dan petunjuk dapat diperbaiki; soal, kunci, poin, kelas, dan jadwal dikunci untuk menjaga hasil penilaian.</p><form autoComplete="off" className="panel management-form" onSubmit={submit}>{error&&<p role="alert" className="form-message error">{error}</p>}<fieldset disabled={busy}><Field label="Judul asesmen" required maxLength={200} value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})}/><TextField label="Deskripsi asesmen" rows={5} maxLength={20000} value={draft.description??""} onChange={e=>setDraft({...draft,description:e.target.value})}/><TextField label="Petunjuk pengerjaan" rows={5} maxLength={20000} value={draft.instructions??""} onChange={e=>setDraft({...draft,instructions:e.target.value})}/><div className="form-actions"><ButtonLink href={`/asesmen/${initial.id}`}>Batal</ButtonLink><Button type="submit" variant="primary">{busy?"Menyimpan…":"Simpan perubahan"}</Button></div></fieldset></form></div>;
}
