"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { ProductCard } from "@/components/catalog/ProductCard";
import { usePreferencesStore } from "@/lib/stores/preferences-store";

export default function WishlistPage() {
  const wishlist = usePreferencesStore((s) => s.wishlist);

  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Избранное" current="Избранное" />
      {wishlist.length === 0 ? (
        <p className="mt-6 text-brand-muted">
          В избранном пока пусто. Перейдите в{" "}
          <Link href="/catalog" className="text-brand-accent">
            каталог
          </Link>
          .
        </p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {wishlist.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </Section>
  );
}
