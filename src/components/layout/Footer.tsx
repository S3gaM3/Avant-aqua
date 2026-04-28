import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { siteConfig } from "@/lib/site-config";
import { fetchProductCategories } from "@/lib/woocommerce";

const infoLinks = [
  { href: "/catalog", label: "Каталог оборудования" },
  { href: "/dostavka", label: "Доставка и оплата" },
  { href: "/services", label: "Услуги" },
  { href: "/gallery", label: "Галерея" },
  { href: "/news", label: "Новости" },
  { href: "/contacts", label: "Контакты" },
];

export async function Footer() {
  const categories = await fetchProductCategories({ hideEmpty: false });
  const catalogLinks = categories
    .filter((c) => c.parent === undefined || c.parent === null || Number(c.parent) === 0)
    .slice(0, 6)
    .map((c) => ({
      href: `/catalog/category/${c.slug}`,
      label: c.name,
    }));

  return (
    <footer className="mt-auto border-t border-brand-border bg-brand-surface">
      <div className="border-b border-brand-border bg-brand-hero text-white">
        <Container className="flex flex-col items-start justify-between gap-4 py-8 md:flex-row md:items-center">
          <div>
            <p className="font-heading text-2xl font-semibold">Будьте в курсе трендов</p>
            <p className="mt-1 text-sm text-white/80">
              Подписка на новости, оборудование и практику эксплуатации.
            </p>
          </div>
          <div className="w-full md:w-[360px]">
            <NewsletterForm />
          </div>
        </Container>
      </div>
      <Container className="grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-heading text-lg font-semibold text-brand-primary">AVANT AQUA</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-muted">
            {siteConfig.shortName} поставляет оборудование для бассейнов и SPA, помогает с подбором,
            доставкой и сервисным сопровождением.
          </p>
        </div>
        <div>
          <p className="font-heading text-lg font-semibold text-brand-primary">Контакты</p>
          <ul className="mt-3 space-y-2 text-sm text-brand-muted">
            <li>
              <a href={`tel:${siteConfig.phoneTel}`} className="hover:text-brand-primary">
                {siteConfig.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-brand-primary">
                {siteConfig.email}
              </a>
            </li>
            <li>{siteConfig.address}</li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-lg font-semibold text-brand-primary">Каталог</p>
          <ul className="mt-3 space-y-2 text-sm">
            {catalogLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/catalog" className="text-brand-muted hover:text-brand-primary">
                Все разделы каталога
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-heading text-lg font-semibold text-brand-primary">Информация</p>
          <ul className="mt-3 space-y-2 text-sm">
            {infoLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-brand-muted hover:text-brand-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="text-brand-muted hover:text-brand-primary">
                Политика конфиденциальности
              </Link>
            </li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-brand-border bg-white py-4">
        <Container className="flex flex-col gap-2 text-center text-xs text-brand-muted sm:flex-row sm:justify-between sm:text-left">
          <span>
            © {siteConfig.shortName} {new Date().getFullYear()}. Все права защищены.
          </span>
          <div className="flex items-center justify-center gap-4 sm:justify-end">
            <Link href="/privacy" className="hover:text-brand-primary">
              Политика конфиденциальности
            </Link>
            <Link href="/offer" className="hover:text-brand-primary">
              Договор оферты
            </Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
