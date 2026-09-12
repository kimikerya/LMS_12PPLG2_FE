import type { Role } from "@/modules/auth/types";
import type { IconName } from "@/components/icon";
import { learningModules } from "./learning";

export type NavItem = { href: string; label: string; icon: IconName };
export function navigation(role: Role): NavItem[] {
  if (role === "student") return [
    { href: "/dashboard", label: "Dashboard", icon: "home" },
    { href: "/kelas", label: "Kelas Saya", icon: "classes" },
    { href: "/profil", label: "Profil", icon: "users" },
  ];
  const items: NavItem[] = [
    { href: "/dashboard", label: "Halaman Utama", icon: "home" },
    { href: "/kelas", label: "Kelas", icon: "classes" },
  ];
  if (role === "admin") items.push({ href: "/pengguna", label: "Pengguna", icon: "users" });
  if (role === "teacher") items.push(
    { href: "/materi", label: "Materi", icon: "book" },
    { href: "/tugas", label: "Tugas", icon: "task" },
  );
  if (role !== "admin") items.push({ href: learningModules.assessments.href, label: learningModules.assessments.title, icon: "task" });
  return items;
}
