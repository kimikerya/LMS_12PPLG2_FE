"use client";
export default function PortalError({ reset }: { reset: () => void }) {
  return <section className="panel"><span className="eyebrow">DATA BELUM TERSEDIA</span><h1>Belum dapat memuat halaman</h1><p className="muted">Koneksi ke layanan sekolah mungkin sedang terputus. Coba muat ulang beberapa saat lagi.</p><button className="button primary" onClick={reset}>Coba lagi</button></section>;
}
