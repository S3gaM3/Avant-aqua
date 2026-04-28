import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/sections/PageIntro";
import { CatalogClient } from "@/components/catalog/CatalogClient";
import { fetchProductCategories, fetchProducts } from "@/lib/woocommerce";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Каталог оборудования",
  description: "Каталог оборудования для бассейнов и SPA.",
};

const megaCatalog = [
  "Распродажа",
  "Оборудование OSPA",
  "Фильтровальное оборудование",
  "Насосы для бассейнов",
  "Нагрев и охлаждение",
  "Вентиляционное оборудование",
  "Дезинфицирующее оборудование",
  "Блоки управления",
  "Закладное оборудование",
  "Лестницы и поручни",
  "Освещение и мультимедиа",
  "Трубы и фитинги ПВХ",
  "Химия для бассейнов, прудов и SPA",
  "Аксессуары для бассейна",
];

const partners = [
  "OSPA",
  "Evospace",
  "Dinotec",
  "OSF",
  "Pahlen",
  "Chemoform",
  "T&A",
  "Speck",
  "RunwillPools",
  "Wilo",
];

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([
    fetchProductCategories({ hideEmpty: false }),
    fetchProducts({ perPage: 30 }),
  ]);

  const roots = categories.filter((c) => !c.parent || Number(c.parent) === 0);

  return (
    <Container className="py-10 md:py-14">
      <PageIntro title="Каталог оборудования" current="Каталог оборудования" />

      <Card className="mt-6 p-4">
        <div className="flex flex-wrap gap-2">
          {megaCatalog.map((item) => (
            <Link
              key={item}
              href="/catalog"
              className="rounded-full border border-brand-border bg-brand-surface px-3 py-1 text-xs font-medium text-brand-primary hover:border-brand-accent"
            >
              {item}
            </Link>
          ))}
        </div>
      </Card>

      <Card className="mt-8 bg-brand-surface p-5">
        <h2 className="font-heading text-3xl font-bold text-brand-primary">
          Партнеры-производители
        </h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {partners.map((item) => (
            <span
              key={item}
              className="rounded-[6px] border border-brand-border bg-white px-3 py-2 text-xs font-medium text-brand-primary"
            >
              {item}
            </span>
          ))}
        </div>
      </Card>

      <section className="mt-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-brand-muted">
          Разделы каталога
        </h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {roots.map((category) => (
            <Link
              key={category.id}
              href={`/catalog/category/${category.slug}`}
              className="rounded-[6px] border border-brand-border bg-white px-3 py-2 text-sm font-medium text-brand-primary hover:border-brand-accent"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <CatalogClient products={products} categories={roots} />

      <Card className="mt-12 p-6">
        <h3 className="font-heading text-3xl font-semibold text-brand-primary">
          Каталоги и инструкции
        </h3>
        <p className="mt-2 max-w-3xl text-sm text-brand-muted">
          Рекламные брошюры, инструкции по монтажу и эксплуатации продукции, сертификаты и каталоги
          в формате PDF.
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {["OSPA PDF", "Dinotec PDF", "Pahlen PDF", "Chemoform PDF"].map((doc) => (
            <div
              key={doc}
              className="allpools-placeholder rounded-[8px] border border-brand-border p-3"
            >
              <div className="flex h-[130px] items-end rounded-[6px] border border-dashed border-brand-border bg-white/75 p-3">
                <p className="text-xs text-brand-muted">{doc} placeholder</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Container>
  );
}
