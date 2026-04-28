import type { ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <article
      className={`rounded-[var(--radius-md)] border border-brand-border bg-white shadow-card ${className}`}
    >
      {children}
    </article>
  );
}
