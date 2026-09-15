"use client";
import { useActionState, useState } from "react";
import { login } from "./actions";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const [visible, setVisible] = useState(false);
  return <form autoComplete="off" action={action} className="login-form">
    <div className="field"><label htmlFor="login_id">NIS atau NIP / Nomor pegawai</label><input id="login_id" name="login_id" placeholder="Masukkan NIS atau NIP / nomor pegawai" autoComplete="off" maxLength={50} required /></div>
    <div className="field"><label htmlFor="password">Kata sandi</label><div className="password-field"><input id="password" name="password" type={visible ? "text" : "password"} placeholder="Masukkan kata sandi" autoComplete="off" required /><button type="button" onClick={() => setVisible(!visible)} aria-label={visible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"} aria-pressed={visible}><Icon name="eye" /></button></div></div>
    {state.error && <p className="alert" role="alert">{state.error}</p>}
    <Button variant="primary" className="login-submit" disabled={pending} type="submit">{pending ? "Sedang masuk…" : "Masuk ke portal"}<Icon name="arrow" /></Button>
    <p className="login-help">Siswa menggunakan NIS. Guru, kurikulum, kepala sekolah, dan admin menggunakan NIP / nomor pegawai. Kesulitan masuk? Hubungi administrator sekolah.</p>
  </form>;
}
