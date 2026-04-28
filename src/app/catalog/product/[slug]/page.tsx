import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { ProductGallery } from "@/components/catalog/ProductGallery";
import { JsonLd } from "@/components/system/JsonLd";
import { ProductViewTracker } from "@/components/system/ProductViewTracker";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { fetchProductById, fetchProductBySlug } from "@/lib/woocommerce";
import { formatRub, hasDisplayPrice } from "@/lib/format";
import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

async function resolveProductFromParam(slugParam: string) {
  if (/^\d+$/.test(slugParam)) {
    const byId = await fetchProductById(Number(slugParam));
    if (byId) return byId;
  }
  return fetchProductBySlug(slugParam);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await resolveProductFromParam(slug);
  if (!product) return { title: "Товар не найден" };
  const plain = product.short_description.replace(/<[^>]+>/g, "").slice(0, 160);
  return {
    title: product.name,
    description: plain || product.name,
    alternates: {
      canonical: `${siteConfig.url}/catalog/product/${product.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: plain || product.name,
    },
    openGraph: product.images[0]
      ? { images: [{ url: product.images[0].src, alt: product.images[0].alt }] }
      : undefined,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await resolveProductFromParam(slug);
  if (!product) notFound();

  const hasPrice = hasDisplayPrice(product.price);

  return (
    <Container className="py-12 md:py-16">
      <ProductViewTracker
        id={product.id}
        name={product.name}
        price={Number.parseFloat(product.price || "0")}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          sku: product.sku,
          image: product.images.map((img) => img.src),
          description: product.short_description.replace(/<[^>]+>/g, ""),
          offers: {
            "@type": "Offer",
            priceCurrency: "RUB",
            price: product.price || "0",
            availability:
              product.stock_status === "instock"
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
          },
        }}
      />
      <nav className="text-sm text-brand-muted">
        <Link href="/catalog">Каталог</Link>
        <span className="mx-2">/</span>
        <span className="text-brand-text">{product.name}</span>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} fallbackAlt={product.name} />

        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-brand-primary md:text-4xl">
            {product.name}
          </h1>
          <p className="mt-4 text-sm text-brand-muted">Артикул: {product.sku}</p>
          {hasPrice ? (
            <p className="mt-8 text-3xl font-semibold text-brand-text">
              {formatRub(product.price)}
            </p>
          ) : (
            <p className="mt-8 text-2xl font-semibold text-brand-primary">Цена по запросу</p>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <AddToCartButton product={product} />
            <Button href="/cart" variant="ghost" size="lg">
              Перейти в корзину
            </Button>
          </div>

          <Card className="mt-10 p-6">
            <h2 className="font-heading text-lg font-semibold text-brand-primary">Кратко</h2>
            <div
              className="rich-text-short mt-3 max-w-none text-brand-muted [&_p]:leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: (() => {
                  const s = product.short_description?.trim() ?? "";
                  if (!s) return "<p>Описание уточняется при заказе.</p>";
                  if (s.includes("<")) return s;
                  return `<p>${s}</p>`;
                })(),
              }}
            />
          </Card>
        </div>
      </div>

      <section className="mt-14 border-t border-brand-border pt-12">
        <h2 className="font-heading text-2xl font-bold text-brand-primary">Описание</h2>
        <div
          className="rich-text mt-6 max-w-none text-brand-text [&_h2]:font-heading [&_h2]:text-brand-primary [&_p]:leading-relaxed"
          dangerouslySetInnerHTML={{
            __html:
              product.description ||
              "<p>Полное описание появится после импорта из WooCommerce.</p>",
          }}
        />
      </section>
    </Container>
  );
}
