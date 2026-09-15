import { requireSession } from "@/modules/auth/session";
import { redirect } from "next/navigation";
import { roleLabels } from "@/modules/auth/types";
import { logout } from "@/modules/auth/actions";
export const metadata = { title: "Pengaturan" };
export default async function SettingsPage() {
  const { identity } = await requireSession();
  if (["student","teacher","curriculum","principal"].includes(identity.role)) redirect("/profil");
  return <><div className="page-heading"><div><span className="eyebrow">AKUN ANDA</span><h1>Pengaturan</h1><p>Informasi akun yang digunakan untuk mengakses portal sekolah.</p></div></div><section className="panel account-panel"><span className="avatar large">{identity.login_id.slice(0, 2)}</span><h2>{identity.login_id}</h2><dl><div><dt>ID pengguna</dt><dd>{identity.login_id}</dd></div><div><dt>Peran</dt><dd>{roleLabels[identity.role]}</dd></div><div><dt>Status</dt><dd><span className="badge">Aktif</span></dd></div></dl><p className="muted">Untuk perubahan profil atau kata sandi, hubungi administrator sekolah.</p><form autoComplete="off" action={logout}><button className="button" type="submit">Keluar dari akun</button></form></section></>;
}
