import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "white" | "danger";
function classes(variant: Variant, className = "") {
  return `button ${variant === "secondary" ? "" : variant} ${className}`.trim();
}
export function Button({ variant = "secondary", className, type = "button", ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button type={type} className={classes(variant, className)} {...props} />;
}
export function ButtonLink({ variant = "secondary", className, ...props }: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={classes(variant, className)} {...props} />;
}
