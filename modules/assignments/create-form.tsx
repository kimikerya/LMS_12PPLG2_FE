"use client";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Field, TextField } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import type { Content } from "@/modules/student/types";
import { FilePicker } from "./file-picker";

export function CreateAssignmentForm({ classID, subjectID, back, initial, hasSubmissions=false }: { classID: number; subjectID: number; back: string; initial?: Content; hasSubmissions?: boolean }) {
  const localDate = (v: string | null | undefined) => v ? new Date(new Date(v).getTime()+7*3600000).toISOString().slice(0,16) : "";
  const [retained, setRetained] = useState((initial?.attachments??[]).filter(v=>v.is_file));
  const router = useRouter(); const [files, setFiles] = useState<File[]>([]); const [links, setLinks] = useState<{ name: string; url: string }[]>((initial?.attachments??[]).filter(v=>!v.is_file)); const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [ready, setReady] = useState<FormData | null>(null);
  async function send(data: FormData) {
    setBusy(true); setError("");
    try {
      const response = await fetch(initial ? `/api/assignment-transfer/edit?assignment=${initial.id}` : "/api/assignment-transfer/create", { method: "POST", body: data });
      const result = await response.json();
      if (!response.ok) { setError(result.error || "Tugas belum tersimpan."); return; }
      setFiles([]); setLinks([]); router.push(`/tugas/${result.id}?${initial?"saved":"created"}=1`); router.refresh();
    } catch { setError("Koneksi terputus. Isian dan file tetap ada di halaman ini; periksa daftar tugas sebelum mencoba lagi."); }
    finally { setBusy(false); setReady(null); }
  }
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    if(retained.length+files.length>5){setError("Maksimal 5 file, termasuk lampiran yang dipertahankan. Hapus salah satu lampiran terlebih dahulu.");return;}
    const form = new FormData(event.currentTarget); const publish = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") === "publish";
    const due = String(form.get("due_at") ?? ""), close = String(form.get("close_at") ?? "");
    const data = new FormData(); data.set("metadata", JSON.stringify({ class_id: classID, subject_id: subjectID, title: form.get("title"), instructions: form.get("instructions"), due_at: new Date(`${due}:00+07:00`).toISOString(), close_at: close ? new Date(`${close}:00+07:00`).toISOString() : null, max_points: hasSubmissions ? initial?.max_points??100 : Number(form.get("max_points")), allow_late: form.get("allow_late") === "on", publish, links, ...(initial ? { retained_ids: retained.map(v=>v.id) } : {}) }));
    files.forEach(file => data.append("files", file));
    if (publish) setReady(data); else void send(data);
  }
  return <form autoComplete="off" className="management-form" onSubmit={submit} aria-busy={busy}>
    {error && <p role="alert" className="form-message error">{error}</p>}
    <fieldset disabled={busy}>
      <Field label="Judul" name="title" required maxLength={200} defaultValue={initial?.title} />
      <TextField label="Deskripsi tugas / Petunjuk tugas" name="instructions" defaultValue={initial?.description??""} required maxLength={20000} rows={6} placeholder="Tujuan tugas, langkah pengerjaan, bentuk jawaban, dan kriteria penilaian." />
      <section className="assignment-upload-section"><h3>Lampiran & referensi</h3><p className="muted">Tambahkan bahan bacaan, lembar kerja, atau contoh. Siswa dapat mengunduh file, mengerjakannya, lalu mengunggah file jawaban.</p><ul className="assignment-picked-files">{retained.map(v=><li key={v.id}><span>{v.name}</span><Button onClick={()=>setRetained(items=>items.filter(item=>item.id!==v.id))}>Hapus lampiran</Button></li>)}</ul><FilePicker files={files} onChange={setFiles} />
        {links.map((link, i) => <div className="assignment-link-fields" key={i}><Field label={`Judul tautan ${i + 1}`} required maxLength={200} value={link.name} onChange={e => setLinks(items => items.map((v, j) => i === j ? { ...v, name: e.target.value } : v))} /><Field label={`Alamat tautan ${i + 1}`} type="url" required maxLength={500} placeholder="https://…" value={link.url} onChange={e => setLinks(items => items.map((v, j) => i === j ? { ...v, url: e.target.value } : v))} /><Button aria-label={`Hapus tautan ${i + 1}`} onClick={() => setLinks(items => items.filter((_, j) => i !== j))}>×</Button></div>)}
        <Button disabled={links.length >= 10} onClick={() => setLinks([...links, { name: "", url: "" }])}>+ Tambah tautan</Button>
      </section>
      <div className="teacher-form-grid"><Field label="Tenggat pengumpulan (WIB)" name="due_at" defaultValue={localDate(initial?.due_at)} type="datetime-local" required /><Field label="Batas akhir pengumpulan (WIB)" name="close_at" defaultValue={localDate(initial?.close_at)} type="datetime-local" /></div>
      <Field label="Nilai maksimal" name="max_points" type="number" min="0.01" max="9999.99" step="0.01" defaultValue={initial?.max_points??100} readOnly={hasSubmissions} required />
      {hasSubmissions&&<p className="muted">Nilai maksimal dikunci karena sudah ada jawaban siswa.</p>}<label className="teacher-check"><input type="checkbox" name="allow_late" defaultChecked={initial?.allow_late??false} /> Izinkan pengumpulan setelah tenggat, hingga batas akhir jika diisi.</label>
      <p className="muted">{initial ? "Perubahan pada tugas yang sudah diterbitkan langsung terlihat oleh siswa setelah disimpan." : "Simpan draf untuk diperiksa nanti, atau langsung terbitkan agar tugas dan lampiran tersedia bagi siswa."}</p>
      <div className="form-actions"><ButtonLink href={back}>Batal</ButtonLink><Button type="submit" name="intent" value="draft" disabled={busy}>{initial?"Simpan perubahan":"Simpan draf"}</Button>{(!initial||initial.status==="draft")&&<Button type="submit" name="intent" value="publish" variant="primary" disabled={busy}>{busy ? "Mengunggah & menyimpan…" : "Langsung terbitkan"}</Button>}</div>
    </fieldset>
    {ready && <Modal title="Terbitkan tugas sekarang?" onClose={() => !busy && setReady(null)}><p>Tugas beserta {retained.length+files.length} file dan {links.length} tautan akan langsung tersedia bagi siswa kelas ini.</p><div className="form-actions"><Button disabled={busy} onClick={() => setReady(null)}>Periksa kembali</Button><Button disabled={busy} variant="primary" onClick={() => void send(ready)}>{busy ? "Mengunggah…" : "Ya, terbitkan"}</Button></div></Modal>}
  </form>;
}
