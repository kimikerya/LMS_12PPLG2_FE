import Image from "next/image";
import Link from "next/link";
import { Brand } from "@/components/brand";
import { ButtonLink } from "@/components/ui/button";
import { LandingHeader } from "./header";
import { faqs, features, majors } from "./content";
import "./landing.css";

function DesignIcon({ name, size = 24 }: { name: string; size?: number }) {
  return <Image src={`/figma/landing/${name}.svg`} alt="" width={size} height={size} unoptimized />;
}

export function LandingPage() {
  return <div className="landing" id="beranda">
    <a className="skip-link" href="#landing-main">Lewati ke konten</a>
    <div className="landing-header-shell"><LandingHeader /></div>
    <main id="landing-main" className="landing-main">
      <section className="landing-hero landing-container" aria-labelledby="hero-title">
        <div className="hero-copy">
          <span className="landing-kicker"><span className="kicker-dot" />EDUCATION MANAGEMENT SYSTEM</span>
          <p className="hero-school">SMK Citra Negara</p>
          <h1 id="hero-title">Belajar lebih terarah.<br /><span>Bertumbuh bersama.</span></h1>
          <p className="hero-description">Satu ruang untuk belajar, mengajar, dan terhubung. Mulai perjalanan akademik Anda bersama SMK Citra Negara.</p>
          <div className="hero-actions">
            <ButtonLink href="/login" variant="primary">Masuk ke portal <span aria-hidden="true">↗</span></ButtonLink>
            <ButtonLink href="#tentang">Kenali sekolah <span aria-hidden="true">↓</span></ButtonLink>
          </div>
        </div>
        <div className="hero-visual"> 
          <div className="hero-image-wrap"><Image src="/figma/landing/imgPhoto.png" alt="Gedung sekolah dan lapangan SMK Citra Negara" fill sizes="(max-width: 800px) 90vw, 45vw" preload className="campus-photo" /></div>
        </div>
      </section>
      <div className="landing-audience landing-container"><span>TERHUBUNG DALAM SATU PORTAL</span><p>Siswa <i /> Guru <i /> Admin <i /> Kurikulum <i /> Kepala Sekolah</p></div>

      <section id="tentang" className="landing-about landing-container" aria-labelledby="about-title">
        <div><span className="landing-kicker">TENTANG SEKOLAH</span><h2 id="about-title">Bukan sekadar belajar.<br />Menyiapkan masa depan.</h2><p>SMK Citra Negara adalah sekolah kejuruan yang berfokus pada keterampilan praktis dan kesiapan kerja di industri.</p></div>
        <div className="about-details"><p>Melalui pendampingan dan pembelajaran berbasis proyek, setiap siswa mendapat ruang untuk mengembangkan kemampuan dan menghasilkan karya.</p><ul>{["Keterampilan praktis yang selaras dengan dunia industri", "Pendampingan dan pembelajaran berbasis proyek", "Lingkungan belajar yang mendukung perkembangan siswa"].map(text => <li key={text}><span><DesignIcon name="imgCheck" size={18} /></span>{text}</li>)}</ul></div>
      </section>

      <section className="landing-features" aria-labelledby="features-title"><div className="landing-container">
        <div className="landing-section-heading"><div><span className="landing-kicker">AKTIVITAS AKADEMIK, LEBIH RAPI</span><h2 id="features-title">Kebutuhan sekolah.<br />Dalam satu tempat.</h2></div><p>Ruang digital yang dirancang untuk membantu kegiatan belajar dan pengelolaan sekolah.</p></div>
        <div className="feature-grid">{features.map((feature, index) => <article className="feature-card" key={feature.title}><div className="feature-card-top"><span className={`landing-icon ${feature.tone}`}><DesignIcon name={feature.icon} /></span><span className="feature-number">0{index + 1}</span></div><h3>{feature.title}</h3><p>{feature.body}</p></article>)}</div>
      </div></section>

      <section id="jurusan" className="landing-majors landing-container" aria-labelledby="majors-title">
        <div className="landing-section-heading"><div><span className="landing-kicker">PILIH ARAH, KEMBANGKAN POTENSI</span><h2 id="majors-title">Ruang untuk setiap minat.</h2></div><p>Kenali enam bidang keahlian di SMK Citra Negara.</p></div>
        <div className="major-grid">{majors.map((major, index) => <article className="major-card" key={major.code}><span className="landing-icon mint"><DesignIcon name={major.icon} /></span><div><h3>{major.code}</h3><p>{major.name}</p></div><span className="major-number" aria-hidden="true">0{index + 1}</span></article>)}</div>
      </section>

      <section className="landing-cta landing-container" aria-labelledby="cta-title"><div className="cta-inner"><div><span className="landing-kicker">PORTAL AKADEMIK ANDA</span><h2 id="cta-title">Langkah berikutnya,<br />mulai dari sini.</h2><p>Masuk dengan akun sekolah untuk mengakses kegiatan akademik sesuai peran Anda.</p></div><ButtonLink href="/login" variant="white">Masuk ke portal <span aria-hidden="true">↗</span></ButtonLink></div></section>

      <section id="bantuan" className="landing-help landing-container" aria-labelledby="help-title"><div><span className="landing-kicker">KAMI BANTU ANDA MEMULAI</span><h2 id="help-title">Ada pertanyaan?</h2><p>Temukan panduan singkat sebelum menggunakan portal.</p><div className="help-contact"><strong>Butuh bantuan akun?</strong><p>Hubungi administrator atau tata usaha sekolah untuk informasi akses dan pemulihan akun.</p></div></div><div className="faq-list">{faqs.map(faq => <details key={faq.question}><summary>{faq.question}<span aria-hidden="true">+</span></summary><p>{faq.answer}</p></details>)}</div></section>
    </main>
    <footer className="landing-footer"><div className="landing-container footer-top"><Link href="/" aria-label="SMK Citra Negara — Halaman utama"><Brand schoolLogo /></Link><p>Belajar, berkarya, dan tumbuh bersama.</p><a href="#beranda">Kembali ke atas ↑</a></div><div className="landing-container footer-bottom"><span>© {new Date().getFullYear()} SMK Citra Negara</span><span>Education Management System</span></div></footer>
  </div>;
}
