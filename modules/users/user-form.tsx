"use client";

import { useCallback, useState } from "react";
import { ActionForm, Field, SelectField } from "@/components/ui/form";
import { ButtonLink } from "@/components/ui/button";
import { roleLabels, type Role } from "@/modules/auth/types";
import { saveUser } from "./actions";
import { statusLabels, type UserDetail } from "./types";

export function UserForm({ user, returnTo, initialRole = "student" }: { user?: UserDetail; returnTo?: string | null; initialRole?: Role }) {
  const [role, setRole] = useState<Role>(user?.role ?? initialRole);
  const [manualID, setManualID] = useState(!!user);
  const restoreState = useCallback((state: { role?: string }) => {
    if (!user && state.role && Object.hasOwn(roleLabels, state.role)) setRole(state.role as Role);
  }, [user]);
  return <ActionForm action={saveUser.bind(null, user?.id ?? null)} onStateChange={restoreState} submitLabel={user ? "Simpan perubahan" : "Buat akun"} cancel={<ButtonLink href={returnTo ?? "/pengguna"}>Batal</ButtonLink>}>
    {returnTo && <input type="hidden" name="returnTo" value={returnTo} />}
    <div className="form-layout"><section className="panel"><h2>Informasi pengguna</h2><p className="muted">Lengkapi identitas dan akses akun sekolah.</p>
      <div className="form-grid">
        <Field name="full_name" label="Nama lengkap" defaultValue={user?.full_name} required maxLength={150} autoComplete="name" />
        <SelectField name="role" label="Peran pengguna" value={role} onChange={e => setRole(e.target.value as Role)} disabled={!!user} required hint={user ? "Peran akun tetap; penempatan siswa dan guru diatur pada detail kelas." : undefined}>{Object.entries(roleLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>
        <div>{!user && <label className="manual-id-option"><input type="checkbox" checked={manualID} onChange={e => setManualID(e.target.checked)} />Isi ID pengguna sendiri</label>}{manualID ? <Field name="login_id" label="ID pengguna" defaultValue={user?.login_id} required maxLength={100} autoComplete="off" hint="Dipakai untuk masuk ke portal." /> : <p className="form-message">ID pengguna dibuat otomatis setelah akun disimpan. Anda tidak perlu menghitung nomor akun.</p>}</div>
        <Field name="email" label="Alamat email" type="email" defaultValue={user?.email} hint="Opsional. Masuk ke portal tetap menggunakan ID pengguna." maxLength={255} autoComplete="email" />
      </div>
      <h3 className="form-section-title">Data pribadi</h3><div className="form-grid"><Field label="Tempat lahir" name="birth_place" maxLength={100} defaultValue={user?.birth_place ?? ""} /><Field label="Tanggal lahir" name="birth_date" type="date" defaultValue={user?.birth_date ?? ""} /><Field label="Nomor HP" name="phone" type="tel" maxLength={25} autoComplete="tel" defaultValue={user?.phone ?? ""} hint="Opsional, sertakan 0 atau kode negara di awal." /></div>
      <h3 className="form-section-title">Identitas {roleLabels[role].toLowerCase()}</h3><div className="form-grid" key={role}>
        {role === "student" ? <><Field label="NIS" name="nis" required maxLength={50} defaultValue={user?.nis ?? ""} /><Field label="NISN" name="nisn" maxLength={50} defaultValue={user?.nisn ?? ""} /></> : <><Field label="NIP / Nomor pegawai" name="employee_id" maxLength={50} defaultValue={user?.employee_id ?? ""} hint="Opsional, gunakan nomor pegawai yang berlaku di sekolah." />{role !== "admin" && <Field label="NUPTK" name="nuptk" maxLength={50} defaultValue={user?.nuptk ?? ""} hint="Opsional, untuk tenaga pendidik yang memilikinya." />}</>}
      </div>
    </section><aside className="panel"><h2>Akses akun</h2><Field name="password" label={user ? "Kata sandi baru" : "Kata sandi awal"} type="password" required={!user} minLength={8} maxLength={72} autoComplete="new-password" hint={user ? "Kosongkan untuk mempertahankan kata sandi saat ini." : "Minimal 8 karakter, maksimal 72 byte."} />
      {!user && <SelectField name="status" label="Status akun" defaultValue="active">{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField>}
      <p className="muted">Setelah akun dibuat, siswa dan guru dapat ditempatkan melalui menu Kelas.</p>
    </aside></div>
  </ActionForm>;
}
