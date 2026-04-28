import { Container } from "@/components/ui/Container";

export default function LoadingCompare() {
  return (
    <Container className="py-12 md:py-16">
      <div className="h-10 w-60 animate-pulse rounded bg-brand-surface" />
      <div className="mt-8 h-64 animate-pulse rounded-[8px] bg-brand-surface" />
    </Container>
  );
}
