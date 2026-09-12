"use client";
import Link from "next/link";
import { useState } from "react";
import { Brand } from "@/components/brand";
import { Button, ButtonLink } from "@/components/ui/button";

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  return <header className="landing-header">
    <Link className="landing-brand" href="/" aria-label="SMK Citra Negara — Halaman utama"><Brand schoolLogo /></Link>
    <Button className="landing-menu-toggle" aria-label={open ? "Tutup menu halaman" : "Buka menu halaman"} aria-expanded={open} aria-controls="landing-navigation" onClick={() => setOpen(!open)}>Menu <span aria-hidden="true">{open ? "−" : "+"}</span></Button>
    <nav id="landing-navigation" aria-label="Navigasi halaman sekolah" className={open ? "open" : ""} onKeyDown={e => { if (e.key === "Escape") setOpen(false); }}>
      <a href="#beranda" onClick={() => setOpen(false)}>Halaman Utama</a>
      <a href="#tentang" onClick={() => setOpen(false)}>Tentang</a>
      <a href="#jurusan" onClick={() => setOpen(false)}>Jurusan</a>
      <a href="#bantuan" onClick={() => setOpen(false)}>Bantuan</a>
    </nav>
    <ButtonLink href="/login" variant="primary" className="landing-header-login">Masuk portal <span aria-hidden="true">↗</span></ButtonLink>
  </header>;
}
