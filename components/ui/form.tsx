"use client";

import { useActionState, useEffect, useId, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";

export type FormState = { error?: string; success?: string; role?: string };
export type FormAction = (previous: FormState, data: FormData) => Promise<FormState>;

export function ActionForm({ action, children, submitLabel = "Simpan", cancel, onSuccessText, submitVariant = "primary", onStateChange }: {
  action: FormAction; children: ReactNode; submitLabel?: string; cancel?: ReactNode; onSuccessText?: string; submitVariant?: "primary" | "danger"; onStateChange?: (state: FormState) => void;
}) {
  const [state, submit, pending] = useActionState(action, {});
  useEffect(() => { onStateChange?.(state); }, [onStateChange, state]);
  return <form action={submit} className="management-form" aria-busy={pending}>
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
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><input id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} value={props.type === "file" ? undefined : value ?? current} onChange={event => { if (props.type !== "file") setCurrent(event.target.value); onChange?.(event); }} />{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function SelectField({ label, hint, children, defaultValue, value, onChange, ...props }: ComponentProps<"select"> & { label: string; hint?: string }) {
  const id = useId();
  const [current, setCurrent] = useState(defaultValue ?? "");
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><select id={id} aria-describedby={hint ? `${id}-hint` : undefined} {...props} value={value ?? current} onChange={event => { setCurrent(event.target.value); onChange?.(event); }}>{children}</select>{hint && <small id={`${id}-hint`}>{hint}</small>}</div>;
}
export function TextField({ label, defaultValue, value, onChange, ...props }: ComponentProps<"textarea"> & { label: string }) {
  const id = useId();
  const [current, setCurrent] = useState(defaultValue ?? "");
  return <div className="form-field"><label htmlFor={id}>{label}{props.required && <span aria-hidden="true"> *</span>}</label><textarea id={id} rows={4} {...props} value={value ?? current} onChange={event => { setCurrent(event.target.value); onChange?.(event); }} /></div>;
}
