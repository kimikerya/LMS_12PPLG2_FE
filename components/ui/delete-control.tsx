"use client";
import { useState } from "react";
import { Modal } from "./modal";
import { ActionForm, type FormAction } from "./form";
import { Button } from "./button";
import { Icon } from "@/components/icon";

export function DeleteControl({ kind, name, detail, action, compact = false }: { kind: "pengguna" | "kelas"; name: string; detail: string; action: FormAction; compact?: boolean }) {
  const [open, setOpen] = useState(false);
  return <><Button className={compact ? "table-icon-action danger-action" : undefined} title={`Hapus ${kind} ${name}`} onClick={() => setOpen(true)} aria-label={`Hapus ${kind} ${name}`}>{compact ? <Icon name="trash" width={17} height={17}/> : `Hapus ${kind}`}</Button>{open && <Modal title={`Hapus ${kind}?`} tone="danger" onClose={() => setOpen(false)}>
    <p>Apakah Anda yakin ingin menghapus {kind} berikut dari daftar aktif?</p>
    <div className="confirmation-identity"><span className="avatar">{name.slice(0, 2).toUpperCase()}</span><div><strong>{name}</strong><small>{detail}</small></div></div>
    <p className="form-message error">{kind === "pengguna" ? "Akun tidak dapat masuk lagi ke portal. Riwayat nilai dan kegiatan tetap tersimpan." : "Kelas tidak dapat diakses lagi dan kode bergabung dinonaktifkan. Riwayat nilai dan kegiatan tetap tersimpan."}</p>
    <ActionForm action={action} submitLabel="Ya, hapus" submitVariant="danger" cancel={<Button onClick={() => setOpen(false)}>Batal</Button>}>{null}</ActionForm>
  </Modal>}</>;
}
