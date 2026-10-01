import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold transition disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";
const variants = {
  primary: "bg-brand text-white hover:bg-brand-dark",
  secondary: "bg-white text-brand ring-1 ring-brand/40 hover:bg-tint",
  ghost: "text-foreground/70 hover:bg-black/5",
  danger: "bg-white text-red-700 ring-1 ring-red-300 hover:bg-red-50",
};
type Variant = keyof typeof variants;

export function Button({ variant = "primary", className = "", ...p }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...p} />;
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...p
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={`${base} ${variants[variant]} ${className}`} {...p} />;
}

export function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-foreground/55">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/20";

export function Card({ className = "", ...p }: ComponentProps<"div">) {
  return <div className={`rounded-2xl bg-white p-5 shadow-[0_2px_16px_rgba(20,20,40,0.06)] ring-1 ring-black/5 ${className}`} {...p} />;
}
