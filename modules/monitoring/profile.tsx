import { roleLabels } from "@/modules/auth/types";
import { ActionForm, Field, TextField } from "@/components/ui/form";
import { monitoringProfile } from "./data";
import { saveCurriculumProfile } from "./actions";
import { initials } from "@/modules/student/helpers";

export async function MonitoringProfile({ saved }: { saved: boolean }) {
  const profile = await monitoringProfile();
  return <><div className="page-heading"><div><h1>Profil Saya</h1><p>Identitas dan informasi akun {roleLabels[profile.role]}.</p></div></div>{saved && <p className="form-message success" role="status">Profil berhasil diperbarui.</p>}<div className="student-profile-grid"><aside className="panel student-profile-summary"><span className="student-profile-avatar">{initials(profile.full_name)}</span><h2>{profile.full_name}</h2><span className="badge neutral">{roleLabels[profile.role]}</span><p>{profile.login_id}</p></aside><div><section className="panel"><h2>Informasi pribadi</h2><ActionForm action={saveCurriculumProfile} submitLabel="Simpan perubahan"><Field label="Nama lengkap" name="full_name" required maxLength={150} defaultValue={profile.full_name} /><TextField label="Bio" name="bio" maxLength={1000} defaultValue={profile.bio || ""} /></ActionForm></section><section className="panel"><h2>Identitas sekolah</h2><p className="muted">Hubungi admin untuk memperbarui identitas sekolah atau akses akun.</p><dl className="detail-list">{[["ID pengguna", profile.login_id], ["NIP / Nomor pegawai", profile.employee_id], ["Email", profile.email], ["Nomor HP", profile.phone]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "Belum diisi"}</dd></div>)}</dl></section></div></div></>;
}
