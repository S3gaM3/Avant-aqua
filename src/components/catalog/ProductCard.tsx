"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types/commerce";
import { formatRub, hasDisplayPrice } from "@/lib/format";
import { QuickViewModal } from "@/components/catalog/QuickViewModal";
import { formatShortDescription, formatShortDescriptionHtml } from "@/lib/ru-typography";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { trackEvent } from "@/lib/analytics";

export function ProductCard({ product }: { product: Product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const wishlist = usePreferencesStore((s) => s.wishlist);
  const compare = usePreferencesStore((s) => s.compare);
  const toggleWishlist = usePreferencesStore((s) => s.toggleWishlist);
  const toggleCompare = usePreferencesStore((s) => s.toggleCompare);
  const inWishlist = wishlist.some((p) => p.id === product.id);
  const inCompare = compare.some((p) => p.id === product.id);
  const hasPrice = hasDisplayPrice(product.price);
  const hasDirtySlug = /(стр-\d+|str-\d+|\.jpg|\.jpeg|\.png|\.webp)/i.test(product.slug);
  const productHref = hasDirtySlug
    ? `/catalog/product/${product.id}`
    : `/catalog/product/${product.slug}`;
  return (
    <article className="flex h-full min-h-[470px] flex-col overflow-hidden rounded-[8px] border border-brand-border bg-white shadow-card transition-shadow hover:shadow-card-hover">
      <Link
        href={productHref}
        className="allpools-placeholder flex h-[250px] items-center justify-center border-b border-brand-border p-4"
        onClick={() =>
          trackEvent("select_item", {
            item_id: product.id,
            item_name: product.name,
            source: "product_card_image",
          })
        }
      >
        <Image
          src="/images/placeholder-product.svg"
          alt={product.name}
          width={640}
          height={480}
          className="max-h-full w-auto max-w-full object-contain"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-heading text-lg font-semibold leading-snug text-brand-primary">
          <Link
            href={productHref}
            onClick={() =>
              trackEvent("select_item", {
                item_id: product.id,
                item_name: product.name,
                source: "product_card_title",
              })
            }
          >
            {product.name}
          </Link>
        </h3>
        {product.short_description.includes("<") ? (
          <div
            className="line-clamp-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-muted [&_p]:m-0"
            dangerouslySetInnerHTML={{
              __html: formatShortDescriptionHtml(product.short_description),
            }}
          />
        ) : (
          <p className="line-clamp-3 flex-1 whitespace-pre-line text-sm leading-relaxed text-brand-muted">
            {formatShortDescription(product.short_description)}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          {hasPrice ? (
            <span className="font-medium text-brand-text">{formatRub(product.price)}</span>
          ) : (
            <span className="font-medium text-brand-primary">Цена по запросу</span>
          )}
          <Link
            href={productHref}
            className="rounded-[6px] bg-brand-accent px-4 py-2 text-sm font-medium text-white transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a]"
            onClick={() =>
              trackEvent("select_item", {
                item_id: product.id,
                item_name: product.name,
                source: "product_card_cta",
              })
            }
          >
            Подробнее
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-2 text-sm md:grid-cols-3">
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            className="w-full min-h-[44px] rounded-[6px] border border-brand-primary bg-[#eaf1fb] px-2 py-2 text-center text-[12px] leading-tight text-brand-primary"
          >
            Быстрый просмотр
          </button>
          <button
            type="button"
            onClick={() => {
              toggleWishlist(product);
              trackEvent(inWishlist ? "remove_from_wishlist" : "add_to_wishlist", {
                item_id: product.id,
                item_name: product.name,
              });
            }}
            className={`w-full min-h-[44px] rounded-[6px] border px-2 py-2 text-center text-[12px] leading-tight transition ${
              inWishlist
                ? "border-[#eb5a0b] bg-[#ffe8db] text-brand-primary"
                : "border-[#eb5a0b] bg-white text-brand-primary"
            }`}
          >
            {inWishlist ? "В избранном" : "В избранное"}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleCompare(product);
              trackEvent(inCompare ? "remove_from_compare" : "add_to_compare", {
                item_id: product.id,
                item_name: product.name,
              });
            }}
            className={`w-full min-h-[44px] rounded-[6px] border px-2 py-2 text-center text-[12px] leading-tight transition ${
              inCompare
                ? "border-[#023a7f] bg-[#eaf1fb] text-brand-primary"
                : "border-[#023a7f] bg-white text-brand-primary"
            }`}
          >
            {inCompare ? "В сравнении" : "Сравнить"}
          </button>
        </div>
      </div>
      <QuickViewModal open={quickOpen} onClose={() => setQuickOpen(false)} product={product} />
    </article>
  );
}
