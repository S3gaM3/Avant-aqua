import { Container } from "@/components/ui/Container";

export default function LoadingProduct() {
  return (
    <Container className="py-12 md:py-16">
      <div className="h-5 w-40 animate-pulse rounded bg-brand-surface" />
      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div className="h-[420px] animate-pulse rounded-[8px] bg-brand-surface" />
        <div className="space-y-4">
          <div className="h-10 w-3/4 animate-pulse rounded bg-brand-surface" />
          <div className="h-6 w-32 animate-pulse rounded bg-brand-surface" />
          <div className="h-12 w-48 animate-pulse rounded bg-brand-surface" />
          <div className="h-44 animate-pulse rounded-[8px] bg-brand-surface" />
        </div>
      </div>
    </Container>
  );
}
