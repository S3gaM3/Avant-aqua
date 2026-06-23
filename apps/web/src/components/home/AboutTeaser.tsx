import Link from "next/link";
import { BrandIcon } from "@/components/BrandIcon";
import { Icon } from "@/components/icons/Icon";
import { Typo } from "@/components/Typo";
import { ABOUT_TEASER } from "@/content/pages";
import { ABOUT_DIRECTION_BRAND_ICONS } from "@/lib/brand-icons";
import { enrichHtml } from "@/lib/typography";

type Props = {
  teaser: string;
  aboutHtml: string | null;
};

const DIRECTION_HREFS = ["/catalog", "/catalog", "/services", "/services"] as const;

export function AboutTeaser({ teaser, aboutHtml }: Props) {
  return (
    <section className="section section--muted about-teaser">
      <div className="container">
        <div className="about-teaser__grid">
          <div className="about-teaser__copy">
            <div className="section-head about-teaser__head">
              <h2>
                <Typo>{ABOUT_TEASER.heading}</Typo>
              </h2>
            </div>

            {aboutHtml ? (
              <div
                className="cms-html about-teaser__prose"
                dangerouslySetInnerHTML={{ __html: enrichHtml(aboutHtml) }}
              />
            ) : (
              teaser
                .split(/\n\n+/)
                .filter((paragraph) => paragraph.trim())
                .map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="about-teaser__text">
                    <Typo>{paragraph.trim()}</Typo>
                  </p>
                ))
            )}

            <p className="about-teaser__more">
              <Link href="/about" className="link-more">
                <Typo>{ABOUT_TEASER.moreLink}</Typo>
              </Link>
            </p>
          </div>

          <aside className="about-teaser__spotlight" aria-label={ABOUT_TEASER.directionsAria}>
            <div className="about-teaser__spotlight-glow" aria-hidden />
            <p className="about-teaser__spotlight-since">
              <Typo>{ABOUT_TEASER.spotlightSince}</Typo>
            </p>
            <p className="about-teaser__spotlight-lead">
              <Typo>{ABOUT_TEASER.spotlightLead}</Typo>
            </p>
            <ul className="about-teaser__directions">
              {ABOUT_TEASER.directions.map((item, index) => (
                <li key={item.title}>
                  <Link href={DIRECTION_HREFS[index]} className="about-teaser__direction">
                    <span className="about-teaser__direction-icon" aria-hidden>
                      <BrandIcon name={ABOUT_DIRECTION_BRAND_ICONS[index]} size={24} />
                    </span>
                    <span className="about-teaser__direction-copy">
                      <strong>
                        <Typo>{item.title}</Typo>
                      </strong>
                      <span>
                        <Typo>{item.text}</Typo>
                      </span>
                    </span>
                    <Icon name="chevron-right" size={18} className="about-teaser__direction-arrow" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
            <div className="about-teaser__spotlight-actions">
              <Link href="/catalog" className="btn btn-outline-light btn-sm">
                <Typo>{ABOUT_TEASER.catalogBtn}</Typo>
              </Link>
              <Link href="/contacts" className="btn btn-primary btn-sm">
                <Typo>{ABOUT_TEASER.consultBtn}</Typo>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
