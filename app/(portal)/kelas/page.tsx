import { StudentClasses } from "@/modules/student/classes";
import { studentClasses } from "@/modules/student/data";
import { authorizedData, requireSession } from "@/modules/auth/session";
import { ButtonLink } from "@/components/ui/button";
import { ClassManagement } from "@/modules/classes/class-management";
import { ClassList } from "@/modules/classes/class-list";
import type { Classroom, AcademicOptions } from "@/modules/classes/types";
export const metadata = { title: "Kelas" };
export default async function ClassesPage({searchParams}:{searchParams:Promise<{deleted?:string;kelas?:string}>}) {
  const {deleted,kelas}=await searchParams;
  const { identity } = await requireSession();
  if (identity.role === "student") return <StudentClasses key={kelas} items={await studentClasses()} selectedID={Number(kelas)} />;
  const { data } = await authorizedData<{ data: Classroom[] }>("/api/classes");
  if (identity.role === "admin") {
    const options = await authorizedData<AcademicOptions>("/api/academic-options");
    return <><div className="page-heading"><div><span className="eyebrow">ADMINISTRASI SEKOLAH</span><h1>Manajemen Kelas</h1><p>Kelola kelas, siswa, dan penugasan guru.</p></div><ButtonLink variant="primary" href="/kelas/baru">Buat kelas baru</ButtonLink></div>{deleted === "1" && <p className="form-message success" role="status">Kelas dihapus dari daftar aktif. Riwayat tetap tersimpan.</p>}<ClassManagement classes={data} options={options} /></>;
  }
  return <><div className="page-heading"><div><span className="eyebrow">RUANG BELAJAR</span><h1>Kelas</h1><p>Daftar kelas sesuai keanggotaan dan akses akun Anda.</p></div><div className="button-row">{identity.role === "teacher" && <ButtonLink variant="primary" href="/kelas/baru">Buat kelas baru</ButtonLink>}<span className="count-pill">{data.length} kelas</span></div></div><section className="panel"><ClassList items={data} canManage={identity.role === "teacher"} /></section></>;
}
