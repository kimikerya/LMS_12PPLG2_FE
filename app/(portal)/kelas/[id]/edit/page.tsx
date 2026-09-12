import { requireAdmin } from "@/lib/admin";
import { backend } from "@/lib/api";
import { ClassForm } from "@/modules/classes/class-form";
import { classDetail } from "@/modules/classes/data";
import type { AcademicOptions } from "@/modules/classes/types";
export const metadata = { title: "Edit Kelas" };
export default async function EditClassPage({ params }: { params: Promise<{ id: string }> }) { const session = await requireAdmin(); const { id } = await params; const [classroom, options] = await Promise.all([classDetail(id, session.token), backend<AcademicOptions>("/api/academic-options", { token: session.token })]); return <><div className="page-heading"><div><h1>Edit Kelas</h1><p>Perbarui informasi {classroom.title}.</p></div></div><ClassForm classroom={classroom} options={options} /></>; }
