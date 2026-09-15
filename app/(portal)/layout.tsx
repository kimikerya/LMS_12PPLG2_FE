import { teacherProfile } from "@/modules/teacher/data";
import { monitoringProfile } from "@/modules/monitoring/data";
import { PortalShell } from "@/components/portal-shell";
import { requireSession } from "@/modules/auth/session";
import { studentProfile } from "@/modules/student/data";
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { identity } = await requireSession();
  const profile = identity.role === "student" ? await studentProfile() : identity.role === "teacher" ? await teacherProfile() : ["curriculum", "principal"].includes(identity.role) ? await monitoringProfile() : null;
  return <PortalShell identity={identity} fullName={profile?.full_name}>{children}</PortalShell>;
}
