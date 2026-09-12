import Link from "next/link";
import { authorizedData, requireSession } from "@/modules/auth/session";
import { UserManagement } from "@/modules/users/user-management";
import type { User } from "@/modules/users/types";
export const metadata = { title: "Manajemen Pengguna" };
export default async function UsersPage() {
  const { identity } = await requireSession();
  if (identity.role !== "admin") return <section className="panel"><h1>Akses khusus administrator</h1><p className="muted">Akun Anda tidak memiliki izin untuk mengelola pengguna.</p><Link className="button" href="/dashboard">Kembali ke halaman utama</Link></section>;
  const { data } = await authorizedData<{data:User[]}>("/api/users");
  return <UserManagement users={data} currentUserID={identity.user_id}/>;
}
