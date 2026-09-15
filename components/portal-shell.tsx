"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "./brand";
import { Icon } from "./icon";
import { navigation } from "@/config/navigation";
import { logout } from "@/modules/auth/actions";
import { roleLabels, type Identity } from "@/modules/auth/types";

export function PortalShell({ identity, fullName, children }: { identity: Identity; fullName?: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const items = navigation(identity.role);
  const accountName = fullName || identity.login_id;
  const profileHref = identity.role === "admin" ? "/pengaturan" : "/profil";
  const learningTitle = identity.role === "student" ? ({materi:"Materi",tugas:"Tugas",asesmen:"Asesmen"} as Record<string,string>)[pathname.split("/")[1]] : undefined;
  const active = (href: string) => pathname === href || pathname.startsWith(href + "/") || (href === "/kelas" && !!learningTitle);
  const title = learningTitle ?? (pathname === "/profil" ? "Profil" : pathname === "/pengaturan" ? "Pengaturan" : items.find(i => active(i.href))?.label ?? "Portal Akademik");
  return <div className="portal">
    <a className="skip-link" href="#main-content">Lewati ke konten</a>
    {open && <button className="sidebar-overlay" aria-label="Tutup navigasi" onClick={() => setOpen(false)} />}
    <aside id="sidebar" className={`sidebar ${open ? "is-open" : ""}`}>
      <Link href="/dashboard" className="brand-link" onClick={() => setOpen(false)}><Brand subtitle={`Portal ${roleLabels[identity.role]}`} /></Link>
      <span className="nav-heading">MENU UTAMA</span>
      <nav aria-label="Navigasi utama">{items.map(item => <Link key={item.href} href={item.href} aria-current={active(item.href) ? "page" : undefined} className={`nav-item ${active(item.href) ? "active" : ""}`} onClick={() => setOpen(false)}><Icon name={item.icon} />{item.label}{active(item.href) && <span className="nav-dot" />}</Link>)}</nav>
      <div className="sidebar-bottom">{identity.role === "admin" && <Link href="/pengaturan" className={`nav-item ${pathname === "/pengaturan" ? "active" : ""}`} onClick={() => setOpen(false)}><Icon name="settings" />Pengaturan</Link>}<div className="account">
        <Link href={profileHref} className="account-profile" aria-label={`Buka profil ${accountName}`} aria-current={pathname === profileHref ? "page" : undefined} onClick={() => setOpen(false)}>
          <span className="avatar">{accountName.split(/\s+/).slice(0,2).map(n=>n[0]).join("").toUpperCase()}</span>
          <span className="account-info"><strong>{accountName}</strong><small>{roleLabels[identity.role]}</small></span>
        </Link>
        <form autoComplete="off" action={logout}><button title="Keluar dari akun" aria-label="Keluar dari akun" className="icon-button"><Icon name="logout" /></button></form>
      </div></div>
    </aside>
    <div className="portal-body"><header className="topbar"><div className="topbar-title"><button className="menu-toggle icon-button" onClick={() => setOpen(!open)} aria-label="Buka navigasi" aria-expanded={open} aria-controls="sidebar">☰</button><span>Portal {roleLabels[identity.role]}<span className="breadcrumb-divider">/</span><strong>{title}</strong></span></div></header>
    <main id="main-content" className="main-content">{children}</main>
    <footer className="portal-footer"><span>SMK Citra Negara</span><span>Education Management System</span></footer></div>
  </div>;
}
