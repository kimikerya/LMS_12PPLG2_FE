import { roleLabels } from "@/modules/auth/types";
import { statusLabels, type UserDetail } from "./types";
export function UserSummary({user}:{user:UserDetail}) {
  const identity=user.role==="student"?[["NIS",user.nis],["NISN",user.nisn]]:[["NIP / Nomor pegawai",user.employee_id],...(user.role!=="admin"?[["NUPTK",user.nuptk]]:[])];
  return <section className="panel"><h2>Informasi pengguna</h2><dl className="detail-list">{[["Nama lengkap",user.full_name],["ID pengguna",user.login_id],["Peran",roleLabels[user.role]],["Status",statusLabels[user.status]],["Email",user.email],["Tempat lahir",user.birth_place],["Tanggal lahir",user.birth_date],["Nomor HP",user.phone],...identity].map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value||"Belum diisi"}</dd></div>)}</dl></section>;
}
