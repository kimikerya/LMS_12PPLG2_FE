import { requireAdmin } from "@/lib/admin";
import { ImportForm } from "@/modules/users/import-form";
export const metadata = { title: "Import Pengguna" };
export default async function ImportUsersPage() { await requireAdmin(); return <><div className="page-heading"><div><h1>Import Pengguna</h1><p>Periksa data sebelum menambahkan akun secara bersamaan.</p></div></div><ImportForm /></>; }
