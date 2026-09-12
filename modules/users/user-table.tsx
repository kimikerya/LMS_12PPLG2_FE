"use client";
import Link from "next/link";
import { DeleteControl } from "@/components/ui/delete-control";
import { Icon } from "@/components/icon";
import { EmptyState } from "@/components/empty-state";
import { roleLabels } from "@/modules/auth/types";
import { deleteUser } from "./actions";
import { statusLabels, type User } from "./types";

export function UserTable({users,search,status,returnTo,onFilter,currentUserID}:{users:User[];search:string;status:string;returnTo:string;onFilter:(search:string,status:string)=>void;currentUserID:number}) {
  const filtered=users.filter(u=>(!status||u.status===status)&&[u.full_name,u.login_id,u.email].join(" ").toLowerCase().includes(search.toLowerCase()));
  return <>
    <div className="table-toolbar">
      <label className="search-field"><Icon name="search"/><span className="sr-only">Cari pengguna</span><input placeholder="Cari nama, ID, atau email…" value={search} maxLength={200} onChange={e=>onFilter(e.target.value,status)}/></label>
      <label className="status-filter"><span className="sr-only">Filter status</span><select value={status} onChange={e=>onFilter(search,e.target.value)}><option value="">Semua status</option>{Object.entries(statusLabels).map(([v,label])=><option key={v} value={v}>{label}</option>)}</select></label>
    </div>
    {!filtered.length?<EmptyState icon="users" title="Tidak ada pengguna yang sesuai" description="Coba tab lain atau ubah kata pencarian dan filter status."/>:
      <div className="table-scroll"><table><thead><tr><th scope="col">Nama pengguna</th><th scope="col">ID pengguna</th><th scope="col">Peran</th><th scope="col">Status</th><th scope="col">Aksi</th></tr></thead><tbody>{filtered.map(u=>{
        const href="/pengguna/"+u.id+"?returnTo="+encodeURIComponent(returnTo);
        return <tr key={u.id}><td><div className="table-person"><span className="avatar">{u.full_name.slice(0,2).toUpperCase()}</span><span><strong>{u.full_name}</strong><small>{u.email}</small></span></div></td><td className="mono">{u.login_id}</td><td><span className="role-badge">{roleLabels[u.role]}</span></td><td><span className={"badge "+(u.status!=="active"?"neutral":"")}><span className="status-dot"/>{statusLabels[u.status]??u.status}</span></td><td><div className="row-actions">
          <Link className="table-icon-action" href={href+"&mode=view"} aria-label={"Lihat "+u.full_name} title={"Lihat "+u.full_name}><Icon name="eye" width={17} height={17}/></Link>
          <Link className="table-icon-action" href={href} aria-label={"Edit "+u.full_name} title={"Edit "+u.full_name}><Icon name="edit" width={17} height={17}/></Link>
          {u.id!==currentUserID&&<DeleteControl compact kind="pengguna" name={u.full_name} detail={u.login_id} action={deleteUser.bind(null,u.id,returnTo)}/>}
        </div></td></tr>;
      })}</tbody></table></div>}
    <div className="table-footer">Menampilkan {filtered.length} dari {users.length} pengguna pada tab ini</div>
  </>;
}
