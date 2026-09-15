import type { Metadata } from "next";
import { FormValidation } from "@/components/ui/form-validation";
import "./validation.css";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./globals.css";
import "./management.css";
import "./student.css";
import "./teacher.css";
import "./curriculum.css";
import "./assessments.css";
import "./assignments.css";
import "./activity.css";

export const metadata: Metadata = {
  title: { default: "Portal Akademik · SMK Citra Negara", template: "%s · SMK Citra Negara" },
  description: "Portal akademik terpadu SMK Citra Negara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body><FormValidation />{children}</body></html>;
}
