import { safeURL } from "@/modules/student/helpers";
export type Attachment = { id: number; name: string; url: string; is_file: boolean };
export function Attachments({ items, title = "Lampiran tugas" }: { items?: Attachment[]; title?: string }) {
  if (!items?.length) return null;
  return <section className="assignment-attachments"><h3>{title}</h3><ul>{items.map(item => {
    const href = item.is_file && /^\/api\/learning-files\/(assignment|submission|material)\/[1-9]\d*$/.test(item.url) ? item.url : !item.is_file ? safeURL(item.url) : null;
    return <li key={item.id}><div><strong>{item.name}</strong><small>{item.is_file ? "File lampiran" : "Tautan referensi"}</small></div>{href && <a className="button" href={href} {...(item.is_file ? { download: true } : { target: "_blank", rel: "noopener noreferrer" })}>{item.is_file ? "Unduh" : "Buka tautan"}</a>}</li>;
  })}</ul></section>;
}
