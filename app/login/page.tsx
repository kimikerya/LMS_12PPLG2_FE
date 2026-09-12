import { redirect } from "next/navigation";
import { Brand } from "@/components/brand";
import { Icon } from "@/components/icon";
import { LoginForm } from "@/modules/auth/login-form";
import { getSession } from "@/modules/auth/session";

export default async function LoginPage() {
  const session = await getSession();
  if (session.kind === "authenticated") redirect("/dashboard");
  return <main className="login-page">
    <section className="login-story">
      <Brand />
      <div className="story-content"><span className="eyebrow light">PORTAL AKADEMIK TERPADU</span><h1>Satu ruang.<br />Banyak kesempatan<br />untuk berkembang.</h1><p>Belajar, mengajar, dan mengelola kegiatan sekolah. Semua terhubung dalam satu tempat.</p>
      <div className="story-visual" aria-hidden="true"><span className="visual-ring" /><div className="visual-card"><span className="icon-tile"><Icon name="book" /></span><strong>Belajar lebih terarah</strong><div className="visual-line" /><div className="visual-line short" /><div className="visual-check">✓ <span>Kelas, materi, dan tugas terhubung</span></div></div><div className="floating-label"><Icon name="school" /> Satu portal untuk semua</div></div></div>
      <p className="story-footer">SMK Citra Negara · Tumbuh bersama, raih masa depan.</p>
    </section>
    <section className="login-panel"><div className="mobile-brand"><Brand /></div><div className="login-box"><span className="eyebrow">SELAMAT DATANG KEMBALI</span><h2>Masuk ke akun Anda</h2><p className="muted">Gunakan akun sekolah untuk melanjutkan aktivitas Anda.</p>
    {session.kind === "unavailable" && <p className="alert" role="status">Layanan sedang tidak tersedia. Anda dapat mencoba masuk kembali.</p>}
    <LoginForm /><div className="login-note"><Icon name="lock" /><span>Akses disesuaikan otomatis dengan peran akun Anda.</span></div></div><p className="login-footer">© {new Date().getFullYear()} SMK Citra Negara</p></section>
  </main>;
}
