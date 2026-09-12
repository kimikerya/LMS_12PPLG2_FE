import type { Metadata } from "next";
import "@fontsource-variable/plus-jakarta-sans/wght.css";
import "./globals.css";
import "./management.css";
import "./student.css";

export const metadata: Metadata = {
  title: { default: "Portal Akademik · SMK Citra Negara", template: "%s · SMK Citra Negara" },
  description: "Portal akademik terpadu SMK Citra Negara.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body>{children}</body></html>;
}
