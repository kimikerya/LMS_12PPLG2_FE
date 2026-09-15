"use client";

import { useEffect } from "react";

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
const isControl = (value: EventTarget | null): value is Control => value instanceof HTMLInputElement || value instanceof HTMLSelectElement || value instanceof HTMLTextAreaElement;
function label(control: Control) {
  return control.labels?.[0]?.textContent?.replace(/\*/g, "").trim() || control.getAttribute("aria-label") || "Kolom ini";
}
function message(control: Control) {
  const name = label(control), validity = control.validity;
  if (validity.valueMissing) {
    if (control instanceof HTMLSelectElement) return `Pilih ${name.toLowerCase()} terlebih dahulu.`;
    if (control instanceof HTMLInputElement && ["checkbox", "radio"].includes(control.type)) return "Pilih opsi yang diperlukan sebelum melanjutkan.";
    if (control instanceof HTMLInputElement && control.type === "file") return "Pilih file yang akan diunggah terlebih dahulu.";
    return `${name} wajib diisi.`;
  }
  if (validity.typeMismatch) return control instanceof HTMLInputElement && control.type === "email" ? "Masukkan alamat email yang lengkap, misalnya nama@sekolah.sch.id." : "Masukkan tautan yang lengkap, diawali https:// atau http://.";
  if (validity.badInput) return `Masukkan ${name.toLowerCase()} dalam format yang sesuai.`;
  if (validity.rangeUnderflow) return `${name} tidak boleh kurang dari ${(control as HTMLInputElement).min}.`;
  if (validity.rangeOverflow) return `${name} tidak boleh lebih dari ${(control as HTMLInputElement).max}.`;
  if (validity.tooShort) return `${name} minimal ${(control as HTMLInputElement).minLength} karakter.`;
  if (validity.tooLong) return `${name} maksimal ${(control as HTMLInputElement).maxLength} karakter.`;
  if (validity.stepMismatch) return `Sesuaikan ${name.toLowerCase()} dengan kelipatan ${(control as HTMLInputElement).step || "1"}.`;
  if (validity.patternMismatch) return control.title || `Periksa format ${name.toLowerCase()} sesuai petunjuk kolom.`;
  return `Periksa kembali ${name.toLowerCase()}.`;
}

// Keep native constraint validation, replacing only its browser-language tooltip.
// Capture also covers forms mounted later, dialogs, and raw inputs outside Field.
export function FormValidation() {
  useEffect(() => {
    const errors = new Map<Control, { node: HTMLElement; invalid: string | null }>();
    let serial = 0, first: Control | null = null;
    let focusTimer: ReturnType<typeof setTimeout> | undefined;
    function clear(control: Control) {
      const error = errors.get(control); if (!error) return;
      const ids = (control.getAttribute("aria-describedby") || "").split(/\s+/).filter(id => id && id !== error.node.id);
      if (ids.length) control.setAttribute("aria-describedby", ids.join(" ")); else control.removeAttribute("aria-describedby");
      if (error.invalid === null) control.removeAttribute("aria-invalid"); else control.setAttribute("aria-invalid", error.invalid);
      error.node.remove(); errors.delete(control);
    }
    function show(control: Control) {
      let error = errors.get(control);
      if (!error) {
        const node = document.createElement("p"); node.id = `field-validation-${++serial}`; node.className = "field-validation-message";
        error = { node, invalid: control.getAttribute("aria-invalid") }; errors.set(control, error);
        const container = control.closest(".form-field, .field") || control.closest(".password-field")?.parentElement;
        if (container) container.append(node); else (control.closest("label") || control).after(node);
        control.setAttribute("aria-describedby", [control.getAttribute("aria-describedby"), node.id].filter(Boolean).join(" "));
      }
      error.node.textContent = message(control); control.setAttribute("aria-invalid", "true");
      if (!first) {
        first = control;
        focusTimer = setTimeout(() => { const target = first; first = null; if (target?.isConnected) target.focus(); }, 0);
      }
    }
    function invalid(event: Event) { if (isControl(event.target)) { event.preventDefault(); show(event.target); } }
    function changed(event: Event) {
      if (!isControl(event.target)) return;
      const control = event.target;
      if (control.validity.valid) clear(control);
      else { const error = errors.get(control); if (error) error.node.textContent = message(control); }
      // Selecting one radio satisfies the entire named group.
      if (control instanceof HTMLInputElement && control.type === "radio" && control.form) {
        for (const member of control.form.elements) if (member instanceof HTMLInputElement && member.type === "radio" && member.name === control.name && member.validity.valid) clear(member);
      }
    }
    function reset(event: Event) { if (event.target instanceof HTMLFormElement) for (const control of errors.keys()) if (control.form === event.target) clear(control); }
    const observer = new MutationObserver(() => {
      for (const control of errors.keys()) if (!control.isConnected || !control.willValidate || control.validity.valid) clear(control);
    });
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["required", "disabled", "type", "min", "max", "pattern"] });
    document.addEventListener("invalid", invalid, true); document.addEventListener("input", changed, true); document.addEventListener("change", changed, true); document.addEventListener("reset", reset, true);
    return () => { clearTimeout(focusTimer); observer.disconnect(); document.removeEventListener("invalid", invalid, true); document.removeEventListener("input", changed, true); document.removeEventListener("change", changed, true); document.removeEventListener("reset", reset, true); for (const control of errors.keys()) clear(control); };
  }, []);
  return null;
}
