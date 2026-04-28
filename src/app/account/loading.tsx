import { Container } from "@/components/ui/Container";

export default function AccountLoading() {
  return (
    <Container className="py-12 md:py-16">
      <div className="h-10 w-64 animate-pulse rounded bg-brand-surface" />
      <div className="mt-8 rounded-[8px] border border-brand-border bg-white p-6">
        <div className="h-8 w-40 animate-pulse rounded bg-brand-surface" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-12 animate-pulse rounded bg-brand-surface" />
          <div className="h-12 animate-pulse rounded bg-brand-surface" />
        </div>
      </div>
      <div className="mt-8 rounded-[8px] border border-brand-border bg-white p-6">
        <div className="h-8 w-48 animate-pulse rounded bg-brand-surface" />
        <div className="mt-4 h-24 animate-pulse rounded bg-brand-surface" />
      </div>
    </Container>
  );
}
