import { ActionForm, Field, SelectField, TextField } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { saveClass } from "./actions";
import type { AcademicOptions, Classroom } from "./types";

export function ClassForm({ options, classroom, teacher = false }: { options: AcademicOptions; classroom?: Classroom; teacher?: boolean }) {
  if (!options.years.length || !options.levels.length || !options.majors.length) return <section className="panel"><h2>Data akademik belum lengkap</h2><p>Siapkan tahun ajaran, jenjang dan jurusan sekolah terlebih dahulu agar kelas dapat dibuat.</p><ButtonLink href="/kelas">Kembali ke kelas</ButtonLink></section>;
  return <ActionForm action={saveClass.bind(null, classroom?.id ?? null)} submitLabel={classroom ? "Simpan perubahan kelas" : "Simpan kelas"} cancel={<ButtonLink href={classroom ? `/kelas/${classroom.id}` : "/kelas"}>Batal</ButtonLink>}>
    <div className="form-layout"><section className="panel"><h2>Informasi dasar</h2><p className="muted">Atur identitas kelas untuk tahun ajaran yang dipilih.</p>
      <Field label="Nama kelas" name="title" required maxLength={100} defaultValue={classroom?.title} placeholder="Contoh: 12 PPLG 2" />
      <div className="form-grid"><SelectField name="academic_year_id" label="Tahun ajaran" required defaultValue={classroom?.academic_year_id ?? options.years[0]?.id}>{options.years.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField>
      <SelectField name="education_level_id" label="Jenjang" required defaultValue={classroom?.education_level_id ?? options.levels.find(o => o.name === "SMK")?.id ?? options.levels[0]?.id}>{options.levels.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField>
      <SelectField name="major_id" label="Jurusan" required defaultValue={classroom?.major_id ?? ""}><option value="" disabled>Pilih jurusan</option>{options.majors.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField>
      <SelectField name="grade_level" label="Tingkat kelas" required defaultValue={classroom?.grade_level ?? 10}>{Array.from({ length: 12 }, (_, index) => index + 1).map(grade => <option key={grade} value={grade}>Kelas {grade}</option>)}</SelectField></div>
      {teacher && <SelectField label="Mata pelajaran Anda" name="subject_id" required defaultValue=""><option value="" disabled>Pilih mata pelajaran</option>{options.subjects.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</SelectField>}
      <TextField name="description" label="Deskripsi kelas" maxLength={5000} defaultValue={classroom?.description} placeholder="Deskripsi singkat mengenai kelas ini…" />
    </section><aside className="panel"><h2>Ruang kelas</h2><Field name="room" label="Nama ruang" maxLength={50} defaultValue={classroom?.room} placeholder="Contoh: Gedung B, ruang 204" /><span className="badge">Kelas aktif</span><p className="muted form-section-title">{teacher ? "Anda menjadi guru mata pelajaran di kelas ini. Setelah menyimpan, buat kode bergabung untuk dibagikan kepada siswa." : "Setelah menyimpan, pilih tab Siswa untuk menempatkan siswa dan tab Guru untuk menetapkan wali kelas serta guru mata pelajaran."}</p></aside></div>
  </ActionForm>;
}
