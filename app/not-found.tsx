import Link from "next/link";
export default function NotFound() { return <main className="error-page"><div className="panel"><span className="eyebrow">404</span><h1>Halaman tidak ditemukan</h1><p className="muted">Periksa alamat halaman atau kembali ke beranda.</p><Link className="button primary" href="/dashboard">Ke halaman utama</Link></div></main>; }
