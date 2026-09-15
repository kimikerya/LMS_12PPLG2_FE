"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useTransition } from "react";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { roleLabels, type Role } from "@/modules/auth/types";
import { userListPath } from "./return-path";
import { UserTable } from "./user-table";
import type { User } from "./types";
const order:Role[]=["student","teacher","curriculum","principal","admin"];
export function UserManagement({users,total,page,pageSize,currentUserID}:{users:User[];total:number;page:number;pageSize:number;currentUserID:number}) {
  const router=useRouter();const [busy,startTransition]=useTransition();
  const params=useSearchParams();
  const role=order.includes(params.get("role") as Role)?params.get("role")!:"";
  const status=["active","inactive","locked","pending"].includes(params.get("status")??"")?params.get("status")!:"";
  const query=(params.get("q")??"").slice(0,200);
  const filterUsers=useCallback((search:string,nextStatus:string)=>startTransition(()=>router.replace(userListPath(role,nextStatus,search),{scroll:false})),[role,router]);
  const returnTo=userListPath(role,status,query,page);
  const items=[{href:userListPath("",status,query),label:"Semua"},...order.map(r=>({href:userListPath(r,status,query),label:roleLabels[r]}))];
  return <><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI SEKOLAH</span><h1>Manajemen Pengguna</h1><p>Kelola akun siswa, guru, dan staf dalam satu tempat.</p></div><div className="button-row"><Link className="button" href="/pengguna/import">Import pengguna</Link><Link className="button primary" href={`/pengguna/baru?returnTo=${encodeURIComponent(returnTo)}`}>Tambah pengguna</Link></div></div>
    {params.get("deleted")==="1"&&<p className="form-message success" role="status">Pengguna dihapus dari daftar aktif. Riwayat tetap tersimpan.</p>}
    {params.get("created")==="1"&&<p className="form-message success" role="status">Akun pengguna berhasil dibuat.</p>}
    {params.get("saved")==="1"&&<p className="form-message success" role="status">Perubahan pengguna berhasil disimpan.</p>}
    {/^\d+$/.test(params.get("imported")??"")&&<p className="form-message success" role="status">{Number(params.get("imported"))} pengguna berhasil diimport.</p>}
    <section className="panel table-panel" aria-busy={busy}><AnimatedTabs items={items} selected={userListPath(role,status,query)} label="Filter peran pengguna" onNavigate={href=>startTransition(()=>router.push(href,{scroll:false}))}/><UserTable users={users} total={total} page={page} pageSize={pageSize} pageHref={p=>userListPath(role,status,query,p)} busy={busy} search={query} status={status} returnTo={returnTo} onFilter={filterUsers} currentUserID={currentUserID}/></section></>;
}
