import { requireClassCreator } from "@/lib/admin";
import { backend } from "@/lib/api";
import { ClassForm } from "@/modules/classes/class-form";
import type { AcademicOptions } from "@/modules/classes/types";
export const metadata = { title: "Buat Kelas Baru" };
export default async function NewClassPage() { const session = await requireClassCreator(); const options = await backend<AcademicOptions>("/api/academic-options", { token: session.token }); return <><div className="page-heading"><div><h1>Buat Kelas Baru</h1><p>Tambahkan ruang kelas untuk tahun ajaran sekolah.</p></div></div><ClassForm options={options} teacher={session.identity.role === "teacher"} /></>; }
