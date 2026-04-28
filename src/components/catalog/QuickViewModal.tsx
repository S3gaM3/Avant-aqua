"use client";

import Image from "next/image";
import type { Product } from "@/lib/types/commerce";
import { AddToCartButton } from "@/components/catalog/AddToCartButton";
import { formatRub, hasDisplayPrice } from "@/lib/format";
import { formatShortDescriptionHtml } from "@/lib/ru-typography";

export function QuickViewModal({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  if (!open) return null;
  const img = product.images[0];
  const hasPrice = hasDisplayPrice(product.price);
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[8px] bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-2xl text-brand-primary">{product.name}</h3>
          <button type="button" className="text-brand-muted" onClick={onClose}>
            Закрыть
          </button>
        </div>
        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div className="flex h-[260px] items-center justify-center rounded-[8px] border border-brand-border bg-brand-surface">
            <Image
              src={img?.src ?? "/images/placeholder-product.svg"}
              alt={img?.alt ?? product.name}
              width={520}
              height={390}
              className="max-h-full w-auto max-w-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm text-brand-muted">Артикул: {product.sku || "—"}</p>
            <p className="mt-3 text-lg text-brand-text">
              {hasPrice ? formatRub(product.price) : "Цена по запросу"}
            </p>
            <div className="mt-4">
              <AddToCartButton product={product} />
            </div>
            <div
              className="mt-4 whitespace-pre-line text-sm text-brand-muted [&_p]:m-0"
              dangerouslySetInnerHTML={{
                __html: formatShortDescriptionHtml(
                  product.short_description || "<p>Описание уточняется.</p>",
                ),
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
