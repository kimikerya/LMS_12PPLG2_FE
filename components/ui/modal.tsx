"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "./button";

export function Modal({ title, onClose, children, tone }: { title: string; onClose: () => void; children: ReactNode; tone?: "danger" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const heading = useId();
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement | null;
    dialog.showModal();
    return () => { dialog.close(); previous?.focus(); };
  }, []);
  return <dialog ref={ref} className={`modal ${tone === "danger" ? "confirmation-modal" : ""}`} aria-labelledby={heading} onCancel={event => { event.preventDefault(); onClose(); }}>
    <div className="section-heading"><h2 id={heading}>{tone === "danger" && <span className="confirmation-icon" aria-hidden="true">!</span>}{title}</h2><Button onClick={onClose} aria-label="Tutup dialog">{tone === "danger" ? "\u00d7" : "Tutup"}</Button></div>{children}
  </dialog>;
}
