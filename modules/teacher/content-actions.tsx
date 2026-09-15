"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { Kind } from "@/modules/student/types";
import { learningLabels, learningPaths } from "@/modules/student/helpers";
import { deleteTeachingContent } from "./content-mutations";

export function ContentActions({kind,id,title,back}:{kind:Kind;id:number;title:string;back:string}) {
 const [open,setOpen]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState("");const router=useRouter();
 async function remove(){setBusy(true);setError("");try{const result=await deleteTeachingContent(kind,id);if(result.error){setError(result.error);return;}router.push(back);router.refresh();}catch{setError("Belum dapat menghapus. Periksa koneksi lalu coba lagi.");}finally{setBusy(false);}}
 const label=learningLabels[kind].toLowerCase();
 return <><div className="form-actions"><ButtonLink href={`/${learningPaths[kind]}/${id}/edit`}>Edit {label}</ButtonLink><Button onClick={()=>{setError("");setOpen(true);}}>Hapus {label}</Button></div>{open&&<Modal tone="danger" title={`Hapus ${label}?`} onClose={()=>!busy&&setOpen(false)}><div className="confirmation-subject"><strong>{title}</strong></div><p>Konten ini akan dihapus dari daftar dan tidak dapat dibuka lagi oleh siswa. Riwayat jawaban dan nilai yang sudah tersimpan tetap disimpan dalam sistem.</p>{error&&<p className="form-message error" role="alert">{error}</p>}<div className="form-actions"><Button disabled={busy} onClick={()=>setOpen(false)}>Batal</Button><Button variant="danger" disabled={busy} onClick={()=>void remove()}>{busy?"Menghapus…":"Ya, hapus"}</Button></div></Modal>}</>;
}
