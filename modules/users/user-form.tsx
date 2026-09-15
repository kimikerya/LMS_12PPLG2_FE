"use client";

import { useCallback, useRef, useState } from "react";
import { ActionForm, Field, SelectField } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { roleLabels, type Role } from "@/modules/auth/types";
import { MIN_PASSWORD_CHARACTERS, MAX_PASSWORD_BYTES, PASSWORD_HINT } from "@/modules/auth/password-policy";
import { saveUser } from "./actions";
import { statusLabels, type UserDetail } from "./types";

export function UserForm({ user, returnTo, initialRole = "student" }: { user?: UserDetail; returnTo?: string | null; initialRole?: Role }) {
  const [role, setRole] = useState<Role>(user?.role ?? initialRole);
  const selectedRole = useRef<Role>(user?.role ?? initialRole);
  const [manualID, setManualID] = useState(!!user);
  const restoreState = useCallback((state: { role?: string; error?: string }) => {
    // Server actions can return an error after the form has been submitted.
    // Keep the role selected in the browser so validation never falls back to
    // the page's default (Siswa).
    if (!user && state.error) setRole(selectedRole.current);
  }, [user]);
  return <ActionForm preserveValues action={saveUser.bind(null, user?.id ?? null)} onStateChange={restoreState} submitLabel={user ? "Simpan perubahan" : "Buat akun"} cancel={<ButtonLink href={returnTo ?? "/pengguna"}>Batal</ButtonLink>}>
    {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
    <div className="form-layout"><section className="panel"><h2>Informasi pengguna</h2><p className="muted">Lengkapi identitas dan akses akun sekolah.</p>
      <div className="form-grid">
        <Field name="full_name" label="Nama lengkap" defaultValue={user?.full_name} required maxLength={150} autoComplete="off" />
        <SelectField name="role" label="Peran pengguna" value={role} onChange={e => { const nextRole = e.target.value as Role; selectedRole.current = nextRole; setRole(nextRole); }} disabled={!!user} required hint={user ? "Peran akun tetap; penempatan siswa dan guru diatur pada detail kelas." : undefined}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
        <div>{!user && <label className="manual-id-option"><input type="checkbox" checked={manualID} onChange={e => setManualID(e.target.checked)} />Isi ID pengguna sendiri</label>}{manualID ? <Field name="login_id" label="ID pengguna" defaultValue={user?.login_id} required maxLength={100} autoComplete="off" hint="Kode internal, bukan untuk login. Login menggunakan NIS atau NIP/nomor pegawai." /> : <p className="form-message">ID internal dibuat otomatis setelah akun disimpan. Login menggunakan NIS atau NIP/nomor pegawai.</p>}</div>
        <Field name="email" label="Alamat email" type="email" defaultValue={user?.email} hint="Opsional. Login menggunakan NIS atau NIP/nomor pegawai, bukan email." maxLength={255} autoComplete="off" />
      </div>
      <h3 className="form-section-title">Data pribadi</h3><div className="form-grid"><Field label="Tempat lahir" name="birth_place" maxLength={100} defaultValue={user?.birth_place ?? ""} /><Field label="Tanggal lahir" name="birth_date" type="date" defaultValue={user?.birth_date ?? ""} /><Field label="Nomor HP" name="phone" type="tel" maxLength={25} autoComplete="off" defaultValue={user?.phone ?? ""} hint="Opsional, sertakan 0 atau kode negara di awal." /></div>
      <h3 className="form-section-title">Identitas {roleLabels[role].toLowerCase()}</h3><div className="form-grid" key={role}>
        {role === "student" ? <><Field label="NIS" name="nis" required maxLength={50} defaultValue={user?.nis ?? ""} /><Field label="NISN" name="nisn" maxLength={50} defaultValue={user?.nisn ?? ""} /></> : <><Field label="NIP / Nomor pegawai" name="employee_id" maxLength={50} defaultValue={user?.employee_id ?? ""} hint="Opsional, gunakan nomor pegawai yang berlaku di sekolah." />{role !== "admin" && <Field label="NUPTK" name="nuptk" maxLength={50} defaultValue={user?.nuptk ?? ""} hint="Opsional, untuk tenaga pendidik yang memilikinya." />}</>}
      </div>
    </section><aside className="panel"><h2>Akses akun</h2><Field name="password" label={user ? "Kata sandi baru" : "Kata sandi awal"} type="password" required={!user} minLength={MIN_PASSWORD_CHARACTERS} maxLength={MAX_PASSWORD_BYTES} autoComplete="new-password" hint={user ? `${PASSWORD_HINT} Kosongkan untuk mempertahankan kata sandi saat ini.` : PASSWORD_HINT} />
      {!user && <SelectField name="status" label="Status akun" defaultValue="active">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>}
      <p className="muted">NIS atau NIP/nomor pegawai harus terisi dan unik agar akun dapat login. Setelah akun dibuat, siswa dan guru dapat ditempatkan melalui menu Kelas.</p>
    </aside></div>
  </ActionForm>;
}
