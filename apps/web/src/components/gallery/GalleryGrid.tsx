"use client";

import { GALLERY, t } from "@/content";
import { GalleryLightbox } from "./GalleryLightbox";
import { useGalleryLightbox } from "./useGalleryLightbox";

export type GalleryLightboxItem = {
  id: string;
  imagePath: string;
  title?: string | null;
  description?: string | null;
  category?: string | null;
};

type Props = {
  items: GalleryLightboxItem[];
};

export function GalleryGrid({ items }: Props) {
  const { activeIndex, open, close, setActiveIndex } = useGalleryLightbox(items.length);

  if (items.length === 0) return null;

  return (
    <>
      <div className="gallery-grid">
        {items.map((g, index) => (
          <figure key={g.id} className="gallery-frame gallery-frame--interactive">
            <button
              type="button"
              className="gallery-frame__button"
              onClick={() => open(index)}
              aria-label={t(GALLERY.openPhoto)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={g.imagePath} alt="" className="gallery-frame__img" loading="lazy" />
            </button>
          </figure>
        ))}
      </div>

      {activeIndex !== null ? (
        <GalleryLightbox
          items={items}
          activeIndex={activeIndex}
          onClose={close}
          onPrev={() =>
            setActiveIndex((i) => (i === null ? null : (i - 1 + items.length) % items.length))
          }
          onNext={() => setActiveIndex((i) => (i === null ? null : (i + 1) % items.length))}
        />
      ) : null}
    </>
  );
}
