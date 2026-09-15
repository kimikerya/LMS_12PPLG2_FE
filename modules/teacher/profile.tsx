import { ButtonLink } from "@/components/ui/button";
import { ActionForm, Field, TextField } from "@/components/ui/form";
import { teacherClasses, teacherProfile } from "./data";
import { saveTeacherProfile } from "./actions";
import { initials } from "@/modules/student/helpers";

export async function TeacherProfile({saved}:{saved:boolean}) {
 const [profile,classes]=await Promise.all([teacherProfile(),teacherClasses()]);
 return <div className="student-workspace teacher-workspace"><div className="page-heading"><div><h1>Profil Saya</h1><p>Identitas dan penugasan Anda di sekolah.</p></div></div>{saved&&<p className="form-message success" role="status">Profil berhasil diperbarui.</p>}<div className="student-profile-grid"><aside className="panel student-profile-summary"><span className="student-profile-avatar">{initials(profile.full_name)}</span><h2>{profile.full_name}</h2><span className="badge neutral">Guru</span><p>{profile.login_id}</p></aside><div><section className="panel"><h2>Informasi pribadi</h2><ActionForm action={saveTeacherProfile} submitLabel="Simpan perubahan" cancel={<ButtonLink href="/dashboard">Batal</ButtonLink>}><Field label="Nama lengkap" name="full_name" required maxLength={150} defaultValue={profile.full_name}/><TextField label="Bio" name="bio" maxLength={1000} defaultValue={profile.bio??""}/></ActionForm></section><section className="panel"><h2>Identitas sekolah</h2><p className="muted">Hubungi admin untuk pembaruan NIP atau penugasan kelas.</p><dl className="detail-list"><div><dt>ID pengguna</dt><dd>{profile.login_id}</dd></div><div><dt>NIP / Nomor pegawai</dt><dd>{profile.employee_id||"Belum diisi"}</dd></div><div><dt>NUPTK</dt><dd>{profile.nuptk||"Belum diisi"}</dd></div><div><dt>Email</dt><dd>{profile.email||"Belum diisi"}</dd></div><div><dt>Kelas ajar</dt><dd>{classes.map(c=>c.title).join(", ")||"Belum ada penugasan"}</dd></div></dl></section></div></div></div>;
}
