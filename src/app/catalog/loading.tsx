import { Container } from "@/components/ui/Container";

export default function LoadingCatalog() {
  return (
    <Container className="py-12 md:py-16">
      <div className="h-10 w-72 animate-pulse rounded bg-brand-surface" />
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-[8px] bg-brand-surface" />
        ))}
      </div>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[420px] animate-pulse rounded-[8px] bg-brand-surface" />
        ))}
      </div>
    </Container>
  );
}
