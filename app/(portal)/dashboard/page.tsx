import { TeacherDashboard } from "@/modules/teacher/dashboard";
import { CurriculumDashboard } from "@/modules/curriculum/dashboard";
import { PrincipalDashboard } from "@/modules/principal/dashboard";

import { StudentDashboard } from "@/modules/student/dashboard";
import { AdminDashboard } from "@/modules/admin/dashboard";
import { authorizedData, requireSession } from "@/modules/auth/session";

import type { Classroom } from "@/modules/classes/types";
import type { UserSummary } from "@/modules/admin/dashboard";



export const metadata = { title: "Halaman Utama" };
export default async function DashboardPage() {
  const { identity } = await requireSession();
  if (identity.role === "principal") return <PrincipalDashboard />;
  if (identity.role === "curriculum") return <CurriculumDashboard />;
  if (identity.role === "teacher") return <TeacherDashboard />;
  if (identity.role === "student") return <StudentDashboard />;
  const [classes, users] = await Promise.all([
    authorizedData<{ data: Classroom[] }>("/api/classes"),
    authorizedData<UserSummary>("/api/users/summary"),
  ]);
  const date = new Intl.DateTimeFormat("id-ID", { dateStyle: "long", timeZone: "Asia/Jakarta" }).format(new Date());
  return <AdminDashboard classes={classes.data} users={users} loginID={identity.login_id} date={date} />;
}