import Link from "next/link";
import { authorizedData, requireSession } from "@/modules/auth/session";
import { UserManagement } from "@/modules/users/user-management";
import type { User } from "@/modules/users/types";
import { userListPath } from "@/modules/users/return-path";
export const metadata = { title: "Manajemen Pengguna" };
export default async function UsersPage({searchParams}:{searchParams:Promise<{role?:string|string[];status?:string|string[];q?:string|string[];page?:string|string[]}>}) {
  const { identity } = await requireSession();
  if (identity.role !== "admin") return <section className="panel"><h1>Akses khusus administrator</h1><p className="muted">Akun Anda tidak memiliki izin untuk mengelola pengguna.</p><Link className="button" href="/dashboard">Kembali ke halaman utama</Link></section>;
  const filters=await searchParams;
  const single=(value:string|string[]|undefined)=>Array.isArray(value)?value[0]:value;
  const query=userListPath(single(filters.role),single(filters.status),single(filters.q),Number(single(filters.page) ?? 1)).split("?")[1] ?? "";
  const result = await authorizedData<{data:User[];total:number;page:number;page_size:number}>(`/api/users/page?${query}`);
  return <UserManagement users={result.data} total={result.total} page={result.page} pageSize={result.page_size} currentUserID={identity.user_id}/>;
}
