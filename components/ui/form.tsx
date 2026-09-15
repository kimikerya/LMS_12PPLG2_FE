"use client";

import { startTransition, useActionState, useEffect, useId, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";

export type FormState = { error?: string; success?: string; role?: string };
export type FormAction = (previous: FormState, data: FormData) => Promise<FormState>;

export function ActionForm({ action, children, submitLabel = "Simpan", cancel, onSuccessText, submitVariant = "primary", onStateChange, preserveValues = false }: {
  action: FormAction; children: ReactNode; submitLabel?: string; cancel?: ReactNode; onSuccessText?: string; submitVariant?: "primary" | "danger"; onStateChange?: (state: FormState) => void; preserveValues?: boolean;
}) {
  const [state, submit, pending] = useActionState(action, {});
  useEffect(() => { onStateChange?.(state); }, [onStateChange, state]);
  // Dispatch preserved forms explicitly: React's form-action reset can reset
  // select DOM values even when their controlled state has not changed.
  // Keep drafts only in this mounted form, never in storage or action results.
  return <form autoComplete="off" action={preserveValues ? undefined : submit} onSubmit={preserveValues ? event => {
    event.preventDefault();
    if (pending) return;
    const data = new FormData(event.currentTarget);
    startTransition(() => submit(data));
  } : undefined} onReset={preserveValues ? event => event.preventDefault() : undefined} className="management-form" aria-busy={pending}>
    {state.error && <p className="form-message error" role="alert">{state.error}</p>}
    {state.success ? <div className="form-message success" role="status">{state.success}{onSuccessText && <p>{onSuccessText}</p>}</div> : <>
      <fieldset disabled={pending}>{children}</fieldset>
      <div className="form-actions">{cancel}<Button type="submit" variant={submitVariant} disabled={pending}>{pending ? "Menyimpan…" : submitLabel}</Button></div>
    </>}
  </form>;
}

export function Field({ label, hint, defaultValue, value, onChange, ...props }: ComponentProps<"input"> & { label: string; hint?: string }) {
  const id = useId();
  const [current, setCurrent] = useState(defaultValue ?? "");
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><input autoComplete="off" id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} value={props.type === "file" ? undefined : value ?? current} onChange={event => { if (props.type !== "file") setCurrent(event.target.value); onChange?.(event); }} />{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function SelectField({ label, hint, children, defaultValue, value, onChange, ...props }: ComponentProps<"select"> & { label: string; hint?: string }) {
  const id = useId();
  const [current, setCurrent] = useState(defaultValue ?? "");
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><select autoComplete="off" id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} value={value ?? current} onChange={event => { setCurrent(event.target.value); onChange?.(event); }}>{children}</select>{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function TextField({ label, defaultValue, value, onChange, ...props }: ComponentProps<"textarea"> & { label: string }) {
  const id = useId();
  const [current, setCurrent] = useState(defaultValue ?? "");
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><textarea autoComplete="off" id={id} rows={4} {...props} value={value ?? current} onChange={event => { setCurrent(event.target.value); onChange?.(event); }} /></div>;
}
