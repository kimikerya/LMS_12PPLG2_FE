"use client";
import { useState } from "react";
import { Field } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
export const acceptedFiles = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.ods,.odp,.png,.jpg,.jpeg,.txt,.csv,.zip";
export function FilePicker({ files, onChange, label = "Unggah file lampiran" }: { files: File[]; onChange: (files: File[]) => void; label?: string }) {
  const [error, setError] = useState("");
  return <div><Field label={label} type="file" accept={acceptedFiles} multiple hint="PDF, Word, Excel, PowerPoint, OpenDocument, JPG/PNG, TXT/CSV, atau ZIP. Maksimal 5 file, 10 MB/file, total 25 MB." onChange={e => {
    const added = Array.from(e.target.files ?? []); const next = [...files, ...added]; e.target.value = "";
    const allowed = acceptedFiles.split(",");
    if (next.length > 5 || next.some(f => !f.size || f.size > 10 * 1024 * 1024) || next.reduce((n, f) => n + f.size, 0) > 25 * 1024 * 1024) { setError("Pilih maksimal 5 file yang tidak kosong, maksimal 10 MB/file dan 25 MB total."); return; }
    if (next.some(f => !allowed.includes(`.${f.name.split(".").at(-1)?.toLowerCase()}`))) { setError("Format file belum didukung. Pilih salah satu format yang tercantum."); return; }
    setError(""); onChange(next);
  }} />{error && <p role="alert" className="form-message error">{error}</p>}<ul className="assignment-picked-files">{files.map((file, index) => <li key={`${file.name}-${index}`}><span>{file.name}<small>{(file.size / 1024 / 1024).toFixed(2)} MB</small></span><Button aria-label={`Hapus file ${file.name}`} onClick={() => { onChange(files.filter((_, i) => i !== index)); setError(""); }}>×</Button></li>)}</ul></div>;
}
