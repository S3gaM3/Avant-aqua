"use client";

import { Icon } from "@/components/icons/Icon";
import { DIALOG, GALLERY, t } from "@/content";

export type GalleryLightboxImage = {
  imagePath: string;
};

type Props = {
  items: GalleryLightboxImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
};

export function GalleryLightbox({ items, activeIndex, onClose, onPrev, onNext }: Props) {
  const active = items[activeIndex];
  if (!active) return null;

  return (
    <div className="gallery-lightbox" role="dialog" aria-modal="true" aria-label={t(GALLERY.lightboxAria)}>
      <button
        type="button"
        className="gallery-lightbox__backdrop"
        aria-label={t(DIALOG.closeAria)}
        onClick={onClose}
      />
      <div className="gallery-lightbox__panel">
        <button
          type="button"
          className="gallery-lightbox__close btn btn-ghost btn-icon"
          onClick={onClose}
          aria-label={t(DIALOG.closeAria)}
        >
          <Icon name="close" size={22} />
        </button>
        {items.length > 1 ? (
          <>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--prev"
              aria-label={t(GALLERY.prevPhoto)}
              onClick={onPrev}
            >
              <Icon name="chevron-left" size={24} />
            </button>
            <button
              type="button"
              className="gallery-lightbox__nav gallery-lightbox__nav--next"
              aria-label={t(GALLERY.nextPhoto)}
              onClick={onNext}
            >
              <Icon name="chevron-right" size={24} />
            </button>
          </>
        ) : null}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={active.imagePath} alt="" className="gallery-lightbox__img" />
      </div>
    </div>
  );
}
