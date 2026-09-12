"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="error-page"><div className="panel"><span className="eyebrow">COBA BEBERAPA SAAT LAGI</span><h1>Halaman belum dapat dimuat</h1><p className="muted">Layanan sekolah mungkin sedang tidak tersedia. Data Anda tetap tersimpan.</p><div className="button-row"><button className="button primary" onClick={reset}>Coba lagi</button><Link className="button" href="/login">Kembali ke login</Link></div></div></main>;
}
