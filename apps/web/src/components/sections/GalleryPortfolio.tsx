"use client";

import Link from "next/link";
import { GalleryLightbox } from "@/components/gallery/GalleryLightbox";
import { useGalleryLightbox } from "@/components/gallery/useGalleryLightbox";
import { SectionHead } from "@/components/layout/SectionHead";
import { Typo } from "@/components/Typo";
import { GALLERY, t } from "@/content";
import { GALLERY_PORTFOLIO } from "@/content/pages";

export type GalleryPortfolioItem = {
  id: string;
  imagePath: string;
  title: string | null;
};

type Props = {
  items: GalleryPortfolioItem[];
  limit?: number;
};

export function GalleryPortfolio({ items, limit = 8 }: Props) {
  const visible = items.slice(0, limit);
  const { activeIndex, open, close, setActiveIndex } = useGalleryLightbox(visible.length);

  if (visible.length === 0) return null;

  return (
    <section className="section section--muted">
      <div className="container">
        <SectionHead
          title={<Typo>{GALLERY_PORTFOLIO.title}</Typo>}
          subtitle={<Typo>{GALLERY_PORTFOLIO.subtitle}</Typo>}
          action={
            <Link href="/gallery" className="link-more">
              <Typo>{GALLERY_PORTFOLIO.allProjects}</Typo>
            </Link>
          }
        />
        <div className="portfolio__grid">
          {visible.map((item, index) => (
            <figure key={item.id} className="portfolio__card portfolio__card--interactive">
              <button
                type="button"
                className="portfolio__card__button"
                onClick={() => open(index)}
                aria-label={t(GALLERY.openPhoto)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.imagePath} alt="" loading="lazy" decoding="async" />
              </button>
            </figure>
          ))}
        </div>
      </div>

      {activeIndex !== null ? (
        <GalleryLightbox
          items={visible}
          activeIndex={activeIndex}
          onClose={close}
          onPrev={() =>
            setActiveIndex((i) => (i === null ? null : (i - 1 + visible.length) % visible.length))
          }
          onNext={() => setActiveIndex((i) => (i === null ? null : (i + 1) % visible.length))}
        />
      ) : null}
    </section>
  );
}
