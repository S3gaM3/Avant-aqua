import { Container } from "@/components/ui/Container";

export default function LoadingWishlist() {
  return (
    <Container className="py-12 md:py-16">
      <div className="h-10 w-52 animate-pulse rounded bg-brand-surface" />
      <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-[420px] animate-pulse rounded-[8px] bg-brand-surface" />
        ))}
      </div>
    </Container>
  );
}
