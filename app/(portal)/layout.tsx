import { PortalShell } from "@/components/portal-shell";
import { requireSession } from "@/modules/auth/session";
import { studentProfile } from "@/modules/student/data";
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const { identity } = await requireSession();
  const profile = identity.role === "student" ? await studentProfile() : null;
  return <PortalShell identity={identity} fullName={profile?.full_name}>{children}</PortalShell>;
}
