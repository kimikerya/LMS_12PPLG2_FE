"use client";

import { useMemo, useState } from "react";
import type { Content } from "@/modules/student/types";

type ExportScope = { classID: number; subjectID: number; className?: string; subjectName?: string };
function exportURL({ classID, subjectID, assignmentID, from, to, status }: ExportScope & { assignmentID?: number; from?: string; to?: string; status?: string }) {
  const params = new URLSearchParams({ class_id: String(classID), subject_id: String(subjectID) });
  if (assignmentID) params.set("assignment_id", String(assignmentID));
  if (from && to) { params.set("from", from); params.set("to", to); }
  if (status) params.set("status", status);
  return `/api/teacher-exports/grades?${params}`;
}
export function AssignmentGradeExportLink({ classID, subjectID, assignmentID }: ExportScope & { assignmentID: number }) {
  return <a className="button secondary" href={exportURL({ classID, subjectID, assignmentID })}>Ekspor nilai</a>;
}
export function TeacherGradeExport({ classID, subjectID, className, subjectName, assignments }: ExportScope & { assignments: Content[] }) {
  const today = new Date().toISOString().slice(0, 10), start = `${new Date().getFullYear()}-01-01`;
  const [assignmentID, setAssignmentID] = useState(""), [from, setFrom] = useState(start), [to, setTo] = useState(today), [status, setStatus] = useState("");
  const href = useMemo(() => exportURL({ classID, subjectID, assignmentID: assignmentID ? Number(assignmentID) : undefined, from, to, status }), [classID, subjectID, assignmentID, from, to, status]);
  return <section className="panel"><div className="section-heading"><div><h2>Ekspor rekap kelas</h2><p className="muted">Unduh pelacakan pengumpulan dan nilai siswa untuk tugas yang Anda buat.</p></div><a className="button primary" href={href}>Ekspor rekap kelas</a></div><div className="student-filters">
    <div className="form-field"><label>Kelas</label><select value={String(classID)} disabled><option>{className || "Kelas ini"}</option></select></div><div className="form-field"><label>Mata pelajaran</label><select value={String(subjectID)} disabled><option>{subjectName || "Mata pelajaran ini"}</option></select></div>
    <div className="form-field"><label htmlFor="export-assignment">Tugas</label><select id="export-assignment" value={assignmentID} onChange={e => setAssignmentID(e.target.value)}><option value="">Seluruh tugas</option>{assignments.map(a => <option value={a.id} key={a.id}>{a.title}</option>)}</select></div><div className="form-field"><label htmlFor="export-from">Periode awal</label><input id="export-from" type="date" value={from} max={to} onChange={e => setFrom(e.target.value)} /></div><div className="form-field"><label htmlFor="export-to">Periode akhir</label><input id="export-to" type="date" value={to} min={from} onChange={e => setTo(e.target.value)} /></div>
    <div className="form-field"><label htmlFor="export-status">Status pengumpulan</label><select id="export-status" value={status} onChange={e => setStatus(e.target.value)}><option value="">Semua status</option><option value="submitted">Sudah dikumpulkan</option><option value="not_submitted">Belum dikumpulkan</option><option value="late">Terlambat</option><option value="graded">Sudah dinilai</option><option value="released">Nilai dirilis</option></select></div>
  </div></section>;
}
