"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Field, SelectField } from "@/components/ui/form";
import { EmptyState } from "@/components/empty-state";

export type ReportRow = { id: number; name: string; nis: string; status: string; score: number | null; submitted: string; released: boolean };
export function MonitoringReportTable({ rows, title, maxPoints }: { rows: ReportRow[]; title: string; maxPoints: number | null }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const filtered = rows.filter(r => (!status || r.status === status) && `${r.name} ${r.nis}`.toLowerCase().includes(query.trim().toLowerCase()));
  const graded = rows.filter(r => r.score !== null);
  const average = graded.length ? (graded.reduce((sum, r) => sum + r.score!, 0) / graded.length).toLocaleString("id-ID", { maximumFractionDigits: 2 }) : "—";
  function download() {
    // Spreadsheet applications must treat user-provided text as text, not formulas.
    const cell = (v: string | number) => `"${String(v).replace(/^[\s]*[=+@-]/, m => `'${m}`).replaceAll('"', '""')}"`;
    const data = [["Tugas", "Nama siswa", "NIS", "Status", "Nilai", "Nilai maksimal", "Dikumpulkan", "Nilai dirilis"], ...filtered.map(r => [title, r.name, r.nis, r.status, r.score ?? "", maxPoints ?? "", r.submitted, r.released ? "Ya" : "Belum"])];
    const url = URL.createObjectURL(new Blob(["\uFEFF" + data.map(row => row.map(cell).join(",")).join("\r\n")], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "laporan-tugas.csv"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <><div className="curriculum-report-summary"><div className="panel"><span>Jawaban masuk</span><strong>{rows.filter(r => r.status !== "Belum mengumpulkan").length}</strong></div><div className="panel"><span>Sudah dinilai</span><strong>{graded.length}</strong></div><div className="panel"><span>Rata-rata nilai tugas</span><strong>{average}{maxPoints !== null && <small> / {maxPoints}</small>}</strong></div></div>
    <section className="panel table-panel"><div className="curriculum-filters"><Field label="Cari siswa atau NIS" type="search" value={query} onChange={e => setQuery(e.target.value)} /><SelectField label="Status pengumpulan" value={status} onChange={e => setStatus(e.target.value)}><option value="">Semua status</option>{["Belum mengumpulkan", "Dikumpulkan", "Terlambat", "Sudah dinilai"].map(s => <option key={s}>{s}</option>)}</SelectField><Button onClick={download} disabled={!filtered.length}>Unduh CSV</Button></div>{filtered.length ? <div className="table-scroll"><table><thead><tr><th>Siswa</th><th>NIS</th><th>Status</th><th>Dikumpulkan</th><th>Nilai</th><th>Rilis nilai</th></tr></thead><tbody>{filtered.map(r => <tr key={r.id}><td>{r.name}</td><td>{r.nis || "—"}</td><td>{r.status}</td><td>{r.submitted}</td><td>{r.score ?? "Belum dinilai"}</td><td>{r.released ? "Dirilis" : "Belum dirilis"}</td></tr>)}</tbody></table></div> : <EmptyState title="Tidak ada siswa yang sesuai" description="Ubah filter atau tunggu data pengumpulan tugas." />}<div className="table-footer">{filtered.length} dari {rows.length} siswa. Ringkasan menghitung seluruh data tugas; CSV mengikuti filter.</div></section></>;
}
