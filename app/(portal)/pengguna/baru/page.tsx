import { requireAdmin } from "@/lib/admin";
import { UserForm } from "@/modules/users/user-form";
import { userReturnPath } from "@/modules/users/return-path";
import { roleLabels, type Role } from "@/modules/auth/types";
export const metadata = { title: "Tambah Pengguna" };
export default async function NewUserPage({searchParams}:{searchParams:Promise<{returnTo?:string}>}) {
  await requireAdmin();
  const returnTo=userReturnPath((await searchParams).returnTo) ?? "/pengguna";
  const role=new URL(returnTo,"http://local").searchParams.get("role") ?? "student";
  return <><div className="page-heading"><div><h1>Tambah Pengguna Baru</h1><p>Daftarkan akun siswa, guru, atau staf sekolah.</p></div></div><UserForm returnTo={returnTo} initialRole={Object.hasOwn(roleLabels,role)?role as Role:"student"}/></>;
}
