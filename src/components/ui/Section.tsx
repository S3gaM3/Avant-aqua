import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function Section({
  children,
  className = "",
  containerClassName = "",
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}) {
  return (
    <section className={`ds-section ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
