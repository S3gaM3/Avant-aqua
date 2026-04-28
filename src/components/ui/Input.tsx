import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className = "", ...props }: Props) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded-[var(--radius-sm)] border border-brand-border bg-white px-3 text-sm text-brand-text outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)] placeholder:text-brand-muted focus:border-brand-primary ${className}`}
    />
  );
}
