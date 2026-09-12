import Link from "next/link";
import type { Classroom } from "./types";
import { EmptyState } from "@/components/empty-state";
import { Icon } from "@/components/icon";

export function ClassList({ items, canManage = false }: { items: Classroom[]; canManage?: boolean }) {
  if (!items.length) return <EmptyState title="Belum ada kelas untuk ditampilkan" description="Kelas akan muncul setelah administrator membuat kelas dan mengatur keanggotaannya." />;
  return <div className="class-grid">{items.map(item => <article className="class-card" key={item.id}><div className="class-card-top"><span className="icon-tile"><Icon name="classes" /></span><span className={`badge ${item.status !== "active" ? "neutral" : ""}`}>{item.status === "active" ? "Aktif" : "Diarsipkan"}</span></div><h3>{item.title}</h3><p>Kelas {item.grade_level}{item.room ? ` · Ruang ${item.room}` : ""}</p><div className="class-card-footer"><span>ID kelas #{item.id}</span>{canManage ? <Link className="text-link" href={`/kelas/${item.id}`} aria-label={`Lihat detail ${item.title}`}>Lihat detail <Icon name="arrow" width={16} /></Link> : <span>Akademik</span>}</div></article>)}</div>;
}
