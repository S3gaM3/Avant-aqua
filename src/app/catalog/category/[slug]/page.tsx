import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { ProductCard } from "@/components/catalog/ProductCard";
import { ItemListViewTracker } from "@/components/system/ItemListViewTracker";
import { PageIntro } from "@/components/sections/PageIntro";
import { fetchProductCategories, fetchProducts } from "@/lib/woocommerce";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

function normalizeSlug(value: string): string {
  try {
    return decodeURIComponent(value).trim().toLowerCase();
  } catch {
    return value.trim().toLowerCase();
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cats = await fetchProductCategories();
  const wanted = normalizeSlug(slug);
  const cat = cats.find((c) => normalizeSlug(c.slug) === wanted);
  return {
    title: cat?.name ?? "Категория",
    description: `Товары категории «${cat?.name ?? slug}».`,
    alternates: {
      canonical: `${siteConfig.url}/catalog/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const cats = await fetchProductCategories();
  const wanted = normalizeSlug(slug);
  const cat = cats.find((c) => normalizeSlug(c.slug) === wanted);
  if (!cat) notFound();

  const products = await fetchProducts({ category: cat.slug, perPage: 48 });

  return (
    <Container className="py-12 md:py-16">
      <PageIntro title={cat.name} current={cat.name} />
      <div className="mt-4 text-sm text-brand-muted">
        <Link href="/catalog" className="hover:text-brand-primary">
          Каталог
        </Link>
      </div>
      <ItemListViewTracker listName={`category:${cat.slug}`} products={products} />

      <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {products.length === 0 ? (
        <p className="mt-12 text-brand-muted">
          В этой категории пока нет товаров в базе магазина — позвоните нам, мы подберём позицию по
          каталогу производителя.
        </p>
      ) : null}
    </Container>
  );
}
