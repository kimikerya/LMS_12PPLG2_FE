"use client";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, SelectField, TextField, type FormState } from "@/components/ui/form";
import { Modal } from "@/components/ui/modal";
import { FilePicker } from "@/modules/assignments/file-picker";
import { submitStudentTask } from "./actions";

export function SubmissionForm({ id, title }: { id: number; title: string }) {
  const [type, setType] = useState("text"), [text, setText] = useState(""), [link, setLink] = useState("");
  const [files, setFiles] = useState<File[]>([]), [note, setNote] = useState("");
  const [confirm, setConfirm] = useState(false), [state, setState] = useState<FormState>({});
  const [pending, start] = useTransition(); const router = useRouter();
  const send = () => start(async () => {
    try {
      let result: FormState; const data = new FormData();
      if (type === "file") {
        data.set("metadata", JSON.stringify({ submission_type: "file", text_answer: note || null, link_url: null }));
        files.forEach(file => data.append("files", file));
        const response = await fetch(`/api/assignment-transfer/submit?assignment=${id}`, { method: "POST", body: data });
        const output = await response.json();
        result = response.ok ? { success: "Tugas berhasil dikumpulkan. File jawaban Anda sudah diterima." } : { error: output.error || "File belum berhasil dikirim." };
      } else {
        data.set("submission_type", type); data.set("answer", type === "text" ? text : link);
        result = await submitStudentTask(id, {}, data);
      }
      setState(result); setConfirm(false);
      if (result.success) { setFiles([]); router.refresh(); }
    } catch { setState({ error: "Koneksi terputus. Isian dan file masih ada; periksa status pengumpulan sebelum mencoba lagi." }); setConfirm(false); }
  });
  return <>{state.error && <p className="form-message error" role="alert">{state.error}</p>}{state.success ? <p className="form-message success" role="status">{state.success}</p> : <form autoComplete="off" className="management-form" onSubmit={e => {
    e.preventDefault(); if (type === "file" && !files.length) { setState({ error: "Pilih minimal satu file jawaban." }); return; } setState({}); setConfirm(true);
  }}><fieldset disabled={pending}>
    <SelectField label="Bentuk jawaban" value={type} onChange={e => setType(e.target.value)}><option value="text">Teks jawaban</option><option value="link">Tautan</option><option value="file">Unggah file</option></SelectField>
    {type === "text" ? <TextField label="Jawaban Anda" required value={text} onChange={e => setText(e.target.value)} maxLength={60000} rows={8} /> : type === "link" ? <Field label="Tautan jawaban" type="url" required value={link} onChange={e => setLink(e.target.value)} maxLength={500} placeholder="https://…" hint="Pastikan guru memiliki akses untuk membuka tautan Anda." /> : <><FilePicker files={files} onChange={setFiles} label="File jawaban" /><TextField label="Catatan jawaban (opsional)" maxLength={10000} value={note} onChange={e => setNote(e.target.value)} rows={3} /></>}
    <p className="muted">Periksa jawaban Anda. Tugas yang sudah dikumpulkan belum dapat diganti.</p>
    <Button type="submit" variant="primary" disabled={pending}>Kumpulkan tugas</Button>
  </fieldset></form>}{confirm && <Modal title="Kumpulkan tugas sekarang?" onClose={() => { if (!pending) setConfirm(false); }}><p>Jawaban untuk <strong>{title}</strong> akan dikirim kepada guru.</p><div className="student-answer-preview preserve-lines">{type === "file" ? files.map(file => file.name).join("\n") : type === "text" ? text : link}</div><p className="muted">Jawaban tidak dapat diubah setelah dikumpulkan.</p><div className="form-actions"><Button disabled={pending} onClick={() => setConfirm(false)}>Periksa lagi</Button><Button variant="primary" disabled={pending} onClick={send}>{pending ? "Mengirim…" : "Ya, kumpulkan"}</Button></div></Modal>}</>;
}
