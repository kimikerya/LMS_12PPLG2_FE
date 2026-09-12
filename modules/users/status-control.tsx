"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { ActionForm, SelectField } from "@/components/ui/form";
import { changeUserStatus } from "./actions";
import { statusLabels, type User } from "./types";

export function StatusControl({ user, currentUserID }: { user: User; currentUserID: number }) {
  const [open, setOpen] = useState(false);
  if (user.id === currentUserID) return <small className="muted">Akun Anda</small>;
  return <><Button onClick={() => setOpen(true)} aria-label={`Ubah status ${user.full_name}`}>Ubah status</Button>{open && <Modal title="Ubah status akun" onClose={() => setOpen(false)}><p>Perbarui akses <strong>{user.full_name}</strong>. Akun yang tidak aktif tidak dapat masuk ke portal; data pengguna tetap tersimpan.</p><ActionForm action={changeUserStatus.bind(null, user.id)} submitLabel="Konfirmasi status"><SelectField label="Status baru" name="status" defaultValue={user.status}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</SelectField></ActionForm></Modal>}</>;
}
