import type { ReactNode } from "react";
import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { Typo } from "@/components/Typo";
import { INFO_BANNERS } from "@/content/pages";
import type { BrandIconKey } from "@/lib/brand-icons";

export type InfoPromoCard = {
  eyebrow?: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  icon?: BrandIconKey;
  accent?: boolean;
};

type BandProps = {
  eyebrow?: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  variant?: "water" | "soft";
};

type SectionProps = {
  children: ReactNode;
  muted?: boolean;
  className?: string;
};

export function InfoPromoSection({ children, muted = false, className = "" }: SectionProps) {
  const classes = ["info-promo-section", muted ? "info-promo-section--muted" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes}>
      <div className="container">{children}</div>
    </section>
  );
}

export function InfoPromoBand({
  eyebrow,
  title,
  text,
  href,
  cta,
  variant = "water",
}: BandProps) {
  return (
    <Link
      href={href}
      className={`info-promo-band info-promo-band--${variant}`}
      aria-label={title}
    >
      <div className="info-promo-band__copy">
        {eyebrow ? (
          <p className="info-promo-band__eyebrow">
            <Typo>{eyebrow}</Typo>
          </p>
        ) : null}
        <h2 className="info-promo-band__title">
          <Typo>{title}</Typo>
        </h2>
        <p className="info-promo-band__text">
          <Typo>{text}</Typo>
        </p>
      </div>
      <span className="info-promo-band__cta">
        <Typo>{cta}</Typo>
      </span>
    </Link>
  );
}

export function InfoPromoCards({ cards }: { cards: InfoPromoCard[] }) {
  return (
    <div
      className={`info-promo-cards${cards.length === 2 ? " info-promo-cards--2" : ""}`}
      role="list"
    >
      {cards.map((card) => (
        <Link
          key={card.href + card.title}
          href={card.href}
          className={`info-promo-card${card.accent ? " info-promo-card--accent" : ""}`}
          role="listitem"
        >
          {card.icon ? (
            <BrandIcon name={card.icon} size={40} className="info-promo-card__icon" />
          ) : null}
          {card.eyebrow ? (
            <span className="info-promo-card__eyebrow">
              <Typo>{card.eyebrow}</Typo>
            </span>
          ) : null}
          <span className="info-promo-card__title">
            <Typo>{card.title}</Typo>
          </span>
          <span className="info-promo-card__text">
            <Typo>{card.text}</Typo>
          </span>
          <span className="info-promo-card__cta">
            <Typo>{card.cta}</Typo>
          </span>
        </Link>
      ))}
    </div>
  );
}

/** Главная: под блоком «Маршрут заказа». */
export function HomeWorkflowBanners() {
  const { catalog, services } = INFO_BANNERS.homeWorkflow;
  return (
    <InfoPromoSection>
      <InfoPromoCards
        cards={[
          { ...catalog, href: "/catalog", icon: "pool", accent: true },
          { ...services, href: "/services", icon: "chain" },
        ]}
      />
    </InfoPromoSection>
  );
}

/** Главная: под блоком «О компании». */
export function HomeAboutBanners() {
  const banner = INFO_BANNERS.homeAbout;
  return (
    <InfoPromoSection muted>
      <InfoPromoBand {...banner} href="/contacts" />
    </InfoPromoSection>
  );
}

/** О компании: под основным информационным блоком. */
export function AboutPageBanners() {
  const { catalog, contact } = INFO_BANNERS.aboutPage;
  return (
    <InfoPromoSection muted>
      <InfoPromoCards
        cards={[
          { ...catalog, href: "/catalog", icon: "pool" },
          { ...contact, href: "/contacts", icon: "conversation" },
        ]}
      />
    </InfoPromoSection>
  );
}

/** Каталог: под сеткой разделов. */
export function CatalogHubBanners() {
  const { band, services, about } = INFO_BANNERS.catalogHub;
  return (
    <InfoPromoSection className="info-promo-section--tight">
      <InfoPromoBand {...band} href="/contacts" variant="soft" />
      <div className="info-promo-section__stack">
        <InfoPromoCards
          cards={[
            { ...services, href: "/services", icon: "worker" },
            { ...about, href: "/about", icon: "calendar" },
          ]}
        />
      </div>
    </InfoPromoSection>
  );
}

/** Контакты: под каналами связи. */
export function ContactsPageBanners() {
  const banner = INFO_BANNERS.contacts;
  return (
    <InfoPromoSection muted>
      <InfoPromoBand {...banner} href="/catalog" />
    </InfoPromoSection>
  );
}

/** Услуги: под списком услуг. */
export function ServicesPageBanners() {
  const { catalog, contact } = INFO_BANNERS.services;
  return (
    <InfoPromoSection>
      <InfoPromoCards
        cards={[
          { ...catalog, href: "/catalog", icon: "pool" },
          { ...contact, href: "/contacts", icon: "conversation" },
        ]}
      />
    </InfoPromoSection>
  );
}
