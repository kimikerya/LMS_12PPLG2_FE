"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { roleLabels, type Role } from "@/modules/auth/types";
import { userListPath } from "./return-path";
import { UserTable } from "./user-table";
import type { User } from "./types";
const order:Role[]=["student","teacher","curriculum","principal","admin"];
export function UserManagement({users,currentUserID}:{users:User[];currentUserID:number}) {
  const params=useSearchParams();
  const role=order.includes(params.get("role") as Role)?params.get("role")!:"";
  const status=["active","inactive","locked","pending"].includes(params.get("status")??"")?params.get("status")!:"";
  const query=(params.get("q")??"").slice(0,200);
  const returnTo=userListPath(role,status,query);
  const items=[{href:userListPath("",status,query),label:"Semua"},...order.map(r=>({href:userListPath(r,status,query),label:roleLabels[r]}))];
  return <><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI SEKOLAH</span><h1>Manajemen Pengguna</h1><p>Kelola akun siswa, guru, dan staf dalam satu tempat.</p></div><div className="button-row"><Link className="button" href="/pengguna/import">Import pengguna</Link><Link className="button primary" href={`/pengguna/baru?returnTo=${encodeURIComponent(returnTo)}`}>Tambah pengguna</Link></div></div>
    {params.get("deleted")==="1"&&<p className="form-message success" role="status">Pengguna dihapus dari daftar aktif. Riwayat tetap tersimpan.</p>}
    {params.get("created")==="1"&&<p className="form-message success" role="status">Akun pengguna berhasil dibuat.</p>}
    {params.get("saved")==="1"&&<p className="form-message success" role="status">Perubahan pengguna berhasil disimpan.</p>}
    {/^\d+$/.test(params.get("imported")??"")&&<p className="form-message success" role="status">{Number(params.get("imported"))} pengguna berhasil diimport.</p>}
    <section className="panel table-panel"><AnimatedTabs items={items} selected={returnTo} label="Filter peran pengguna" onNavigate={href=>window.history.pushState(null,"",href)}/><UserTable users={users.filter(u=>!role||u.role===role)} search={query} status={status} returnTo={returnTo} onFilter={(search,nextStatus)=>window.history.replaceState(null,"",userListPath(role,nextStatus,search))} currentUserID={currentUserID}/></section></>;
}
