import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "inverse";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary: "bg-brand-accent text-brand-inverse shadow-card hover:bg-brand-primary",
  secondary: "bg-brand-primary text-brand-inverse shadow-card hover:bg-brand-accent",
  ghost:
    "border border-brand-border bg-white text-brand-text hover:border-brand-primary hover:text-brand-primary",
  inverse: "bg-brand-inverse text-brand-primary shadow-card hover:bg-brand-surface",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-11 px-5 text-base",
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  onClick,
  disabled = false,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
}) {
  const cls = `inline-flex items-center justify-center rounded-[var(--radius-sm)] font-medium transition-colors duration-[var(--duration-base)] ease-[var(--ease-standard)] focus-visible:focus-ring disabled:cursor-not-allowed disabled:opacity-60 ${sizes[size]} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type} className={cls} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
