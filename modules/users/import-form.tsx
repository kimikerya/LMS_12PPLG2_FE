"use client";

import { useState } from "react";
import { ActionForm, Field, SelectField, TextField } from "@/components/ui/form";
import { Button, ButtonLink } from "@/components/ui/button";
import { csvTemplate, importRoleLabel, previewCSV, tableToCSV, type PreviewRow } from "./csv";
import { importUsers } from "./actions";

type ImportSheet = { name: string; source: string };

export function ImportForm() {
  const [source, setSource] = useState("");
  const [pasted, setPasted] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [sheets, setSheets] = useState<ImportSheet[]>([]);
  const [sheetIndex, setSheetIndex] = useState("0");
  const [busy, setBusy] = useState(false);
  const errors = rows.filter(row => row.errors.length).length;

  function preview(text: string, name: string) {
    setError("");
    try { const parsed = previewCSV(text); setSource(text); setRows(parsed); setFileName(name); }
    catch (error) { setError(error instanceof Error ? error.message : "Data belum dapat dibaca."); }
  }
  function download() {
    const url = URL.createObjectURL(new Blob(["\uFEFF" + csvTemplate], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "template-pengguna.csv"; a.click(); URL.revokeObjectURL(url);
  }
  async function upload(file: File) {
    setBusy(true); setError(""); setSheets([]);
    try {
      if (/\.xlsx$/i.test(file.name)) {
        if (file.size > 1_000_000) throw new Error("Berkas Excel maksimal 1 MB.");
        const { default: readWorkbook } = await import("read-excel-file/browser");
        let workbook;
        try { workbook = await readWorkbook(file, { trim: false, parseNumber: value => value }); }
        catch { throw new Error("Excel belum dapat dibaca. Gunakan .xlsx tanpa kata sandi, atau salin tabel ke kolom tempel."); }
        const parsed = workbook.map(sheet => {
          const width = sheet.data[0]?.length ?? 0;
          const records = sheet.data.map(row => Array.from({ length: Math.max(width, row.length) }, (_, i) => {
            const value = row[i]; return value instanceof Date ? value.toISOString().slice(0, 10) : String(value ?? "");
          }));
          return { name: sheet.sheet, source: tableToCSV(records) };
        });
        if (!parsed.length) throw new Error("Berkas Excel tidak memiliki sheet.");
        setSheets(parsed); setSheetIndex("0"); setFileName(file.name);
      } else if (/\.csv$/i.test(file.name)) {
        if (file.size > 100_000) throw new Error("Berkas CSV maksimal 100 KB.");
        preview(await file.text(), file.name);
      } else throw new Error("Gunakan berkas .xlsx atau .csv. Untuk .xls lama, simpan sebagai .xlsx atau tempel tabelnya.");
    } catch (error) { setError(error instanceof Error ? error.message : "Berkas belum dapat dibaca."); }
    finally { setBusy(false); }
  }

  return <><ol className="import-steps"><li aria-current={!rows.length ? "step" : undefined}>1. Masukkan data</li><li aria-current={rows.length ? "step" : undefined}>2. Pratinjau & validasi</li><li>3. Simpan pengguna</li></ol>
    {!rows.length ? <>
      <section className="panel"><div className="section-heading"><h2>Import dari Excel atau CSV</h2><Button onClick={download}>Unduh template CSV</Button></div>
        <p>Isi template di Excel, lalu unggah berkas atau salin tabel beserta judul kolomnya. Maksimal 50 pengguna per import. Excel maksimal 1 MB; CSV dan tabel tempelan maksimal 100 KB.</p>
        <p className="muted">Kolom wajib: Nama lengkap, Peran, Kata sandi. ID pengguna boleh dikosongkan agar dibuat otomatis. NIS wajib untuk siswa. Email, NIP/nomor pegawai, NUPTK, tempat lahir, tanggal lahir, dan nomor HP opsional. Peran dapat diisi Siswa, Guru, Kurikulum, Kepala Sekolah, atau Admin. Semua akun hasil import berstatus aktif.</p>
        <p className="muted">Format ID, NIS, NIP, dan nomor HP sebagai Teks di Excel agar nol di depan tidak hilang. Tanggal lahir dapat memakai tanggal Excel, YYYY-MM-DD, atau DD/MM/YYYY.</p>
        <Field label="Berkas Excel atau CSV" type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" disabled={busy} onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void upload(file); }} />
        {busy && <p role="status">Membaca berkas…</p>}
        {!!sheets.length && <div><SelectField label="Sheet Excel" value={sheetIndex} onChange={e => setSheetIndex(e.target.value)}>{sheets.map((sheet, i) => <option key={i} value={i}>{sheet.name}</option>)}</SelectField><Button variant="primary" onClick={() => { const sheet = sheets[Number(sheetIndex)]; preview(sheet.source, fileName + " · " + sheet.name); }}>Pratinjau sheet</Button></div>}
      </section>
      <section className="panel"><h2>Tempel tabel Excel</h2><p>Blok judul kolom dan baris data di Excel atau Google Sheets, salin, lalu tempel di bawah ini.</p><TextField label="Tabel dari Excel" rows={7} maxLength={100000} value={pasted} onChange={e => setPasted(e.target.value)} placeholder={"ID pengguna\tNama lengkap\tPeran\tKata sandi"} /><Button variant="primary" disabled={busy || !pasted.trim()} onClick={() => preview(pasted, "Tabel Excel")}>Pratinjau tabel</Button></section>
      {error && <p role="alert" className="form-message error">{error}</p>}
    </> : <>
      <div className="summary-cards"><div className="panel"><span>Total baris</span><strong>{rows.length}</strong></div><div className="panel"><span>Valid di tabel</span><strong>{rows.length - errors}</strong></div><div className="panel"><span>Perlu diperbaiki</span><strong>{errors}</strong></div></div>
      <section className="panel table-panel"><div className="table-toolbar"><h2>Pratinjau: {fileName}</h2></div><div className="table-scroll"><table><thead><tr><th>Baris</th><th>Nama lengkap</th><th>ID pengguna</th><th>Peran</th><th>Email</th><th>Identitas sekolah</th><th>Tempat / tanggal lahir</th><th>Nomor HP</th><th>Validasi</th></tr></thead><tbody>{rows.map(row => <tr key={row.row}><td>{row.row}</td><td>{row.user.full_name || "—"}</td><td>{row.user.login_id || "—"}</td><td>{importRoleLabel(row.user.role)}</td><td>{row.user.email || "—"}</td><td>{row.user.role === "student" ? <>NIS: {row.user.nis || "—"}<br />NISN: {row.user.nisn || "—"}</> : <>NIP: {row.user.employee_id || "—"}<br />NUPTK: {row.user.nuptk || "—"}</>}</td><td>{row.user.birth_place || "—"}<br />{row.user.birth_date || "—"}</td><td>{row.user.phone || "—"}</td><td>{row.errors.length ? <span className="validation-error">{row.errors.join("; ")}</span> : <span className="badge">Valid</span>}</td></tr>)}</tbody></table></div></section>
      <p className="muted">Duplikat dengan akun yang sudah terdaftar diperiksa saat menyimpan. Jika ada konflik, seluruh import dibatalkan. Kata sandi tidak ditampilkan dalam pratinjau.</p>
      {errors ? <p role="alert" className="form-message error">Perbaiki {errors} baris pada data sumber, lalu pratinjau ulang.</p> : <ActionForm key={source} action={importUsers} submitLabel={`Simpan ${rows.length} pengguna`}><input type="hidden" name="csv" value={source} /></ActionForm>}
      <Button onClick={() => { setRows([]); setSource(""); setError(""); }}>Kembali ke sumber data</Button>
    </>}<div className="back-link"><ButtonLink href="/pengguna">Kembali ke pengguna</ButtonLink></div>
  </>;
}
