"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/types/commerce";

export function ProductGallery({
  images,
  fallbackAlt,
}: {
  images: ProductImage[];
  fallbackAlt: string;
}) {
  const [index, setIndex] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const list =
    images.length > 0
      ? images
      : [{ id: 0, src: "/images/placeholder-product.svg", alt: fallbackAlt }];
  const current = list[index] ?? list[0];

  return (
    <div>
      <button
        type="button"
        onClick={() => setZoomOpen(true)}
        className="flex h-[360px] w-full items-center justify-center overflow-hidden rounded-[8px] border border-brand-border bg-brand-surface p-4 shadow-card md:h-[460px]"
      >
        <Image
          src={current.src}
          alt={current.alt || fallbackAlt}
          width={960}
          height={720}
          className="max-h-full w-auto max-w-full object-contain"
          priority
        />
      </button>
      <div className="mt-3 flex gap-2 overflow-x-auto">
        {list.map((img, idx) => (
          <button
            type="button"
            key={img.id}
            onClick={() => setIndex(idx)}
            className={`rounded-[6px] border p-1 ${idx === index ? "border-brand-accent" : "border-brand-border"}`}
          >
            <Image
              src={img.src}
              alt={img.alt || fallbackAlt}
              width={72}
              height={72}
              className="h-14 w-14 object-cover"
            />
          </button>
        ))}
      </div>
      {zoomOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomOpen(false)}
        >
          <div className="relative max-h-[90vh] w-full max-w-5xl">
            <button
              type="button"
              className="absolute right-3 top-3 z-10 rounded bg-white/90 px-3 py-1 text-sm"
              onClick={() => setZoomOpen(false)}
            >
              Закрыть
            </button>
            <Image
              src={current.src}
              alt={current.alt || fallbackAlt}
              width={1600}
              height={1200}
              className="max-h-[90vh] w-full rounded-[8px] object-contain bg-white"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
