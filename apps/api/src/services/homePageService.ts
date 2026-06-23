import { prisma } from "@avant/db";
import {
  CATALOG_ROOT_SLUGS,
  DEFAULT_PARTNER_NAMES,
  effectivePriceRetail,
  enrichPartners,
  pickCatalogRootSections,
} from "@avant/shared";
import { catalogProductWhere } from "../lib/product-display.js";

const FOUNDED_YEAR = 1998;

/** Синхронизировать формулировки с apps/web/src/content/pages.ts */

/** Популярные товары на главной: 2 ряда по 3 в сетке. */
export const HOME_FEATURED_PRODUCTS_LIMIT = 6;

export const HOME_WORKFLOW_DEFAULT = [
  {
    title: "Заявка и консультация",
    text: "Подберём оборудование под объект — частный бассейн, SPA или коммерческий комплекс.",
    timeline: "в течение дня",
  },
  {
    title: "Коммерческое предложение",
    text: "Сформируем спецификацию и сроки поставки с учётом прайса и наличия.",
    timeline: "от 1 дня",
  },
  {
    title: "Поставка и комплектация",
    text: "Организуем доставку по Москве и регионам, комплектуем заказ «под ключ».",
    timeline: "от 3 дней",
  },
  {
    title: "Сервис и сопровождение",
    text: "Помогаем с запуском, расходниками и последующим обслуживанием.",
    timeline: "по договорённости",
  },
] as const;

const HERO_DEFAULTS: Record<string, string> = {
  hero_eyebrow: "Инженерные решения AVANT AQUA",
  hero_h1: "Оборудование для бассейнов и SPA от ведущих производителей",
  hero_lead:
    "Насосы, фильтры, дезинфекция, освещение и комплектующие — подбор, поставка и сервис для частных и коммерческих объектов по всей России.",
  hero_badge: "С 1998 года · ООО «Авант» · Москва",
  hero_card_1_title: "Подбор под объект",
  hero_card_1_text: "Комплектация от проекта до запуска",
  hero_card_2_title: "Монтаж и сервис",
  hero_card_2_text: "Поставка, запуск и сопровождение",
  hero_card_3_title: "Проверенные бренды",
  hero_card_3_text: "OSF, Filtreau, Bowman и другие производители",
  about_teaser:
    "С 1998 года «Авант» проектирует и поставляет оборудование для бассейнов и SPA-комплексов. Берём на себя полный цикл: подбор решений, комплектацию, запуск и сервисное сопровождение — для частных заказчиков и бизнеса.\n\nОсновной регион работы — Москва и Московская область; выполняем удалённые поставки по всей России. Консультируем по подбору насосов, фильтрации, дезинфекции и автоматики под конкретный объект.\n\nРаботаем с проверенными брендами — OSF, Filtreau, Bowman и другими производителями. Помогаем смонтировать систему «под ключ» или дополнить действующий комплекс запчастями и сервисом.",
  cta_title: "Нужна консультация по подбору оборудования?",
  cta_lead:
    "Оставьте заявку — менеджер перезвонит, уточнит задачу и подготовит коммерческое предложение по каталогу.",
  home_promo_enabled: "0",
  home_promo_badge: "Акция",
  home_promo_title: "Сезонные новинки и спецпредложения",
  home_promo_text: "Актуальные позиции со скидками в каталоге",
  home_promo_href: "/catalog?discount=1",
  home_promo_cta: "Смотреть предложения",
  stats_years: "",
  stats_projects: "",
  stats_brands: "",
};

export type HomeHeroCard = { title: string; text: string };
export type HomeWorkflowStep = { title: string; text: string; timeline?: string };
export type HomePromoBanner = {
  badge: string;
  title: string;
  text: string | null;
  href: string;
  cta: string;
};

export type HomePagePayload = {
  hero: {
    eyebrow: string;
    h1: string;
    lead: string;
    badge: string;
    imageUrl: string | null;
    videoUrl: string | null;
    cards: HomeHeroCard[];
  };
  aboutTeaser: string;
  aboutHtml: string | null;
  cta: { title: string; lead: string };
  workflow: HomeWorkflowStep[];
  stats: {
    years: number;
    projects: number;
    brands: number;
    productCount: number;
  };
  categories: { id: string; slug: string; name: string; children?: unknown[] }[];
  products: {
    id: string;
    slug: string;
    sku: string;
    name: string;
    brand?: string;
    stockStatus?: string;
    shortDescription?: string | null;
    discountPercent?: string | null;
    priceRetail: string;
    priceFinal: string;
    images: { path: string }[];
  }[];
  partners: { name: string; logoPath: string | null; url: string | null }[];
  promo: HomePromoBanner | null;
};

function isTruthySetting(value: string | undefined): boolean {
  const v = value?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function parseHomePromo(map: Record<string, string>): HomePromoBanner | null {
  if (!isTruthySetting(map.home_promo_enabled)) return null;

  const title = setting(map, "home_promo_title", HERO_DEFAULTS.home_promo_title).trim();
  const href = setting(map, "home_promo_href", HERO_DEFAULTS.home_promo_href).trim();
  if (!title || !href) return null;

  const textRaw = setting(map, "home_promo_text", HERO_DEFAULTS.home_promo_text).trim();

  return {
    badge: setting(map, "home_promo_badge", HERO_DEFAULTS.home_promo_badge),
    title,
    text: textRaw || null,
    href,
    cta: setting(map, "home_promo_cta", HERO_DEFAULTS.home_promo_cta),
  };
}

function setting(map: Record<string, string>, key: string, fallback: string): string {
  const v = map[key]?.trim();
  return v || fallback;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  const n = Number.parseInt(value?.trim() ?? "", 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function parseWorkflow(map: Record<string, string>): HomeWorkflowStep[] {
  const raw = map.home_workflow_steps?.trim();
  if (!raw) return [...HOME_WORKFLOW_DEFAULT];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [...HOME_WORKFLOW_DEFAULT];
    const steps = parsed
      .filter(
        (s): s is HomeWorkflowStep =>
          typeof s === "object" && s !== null && "title" in s && "text" in s,
      )
      .map((s) => ({
        title: String(s.title),
        text: String(s.text),
        timeline: s.timeline ? String(s.timeline) : undefined,
      }));
    return steps.length > 0 ? steps : [...HOME_WORKFLOW_DEFAULT];
  } catch {
    return [...HOME_WORKFLOW_DEFAULT];
  }
}

export async function getHomePageData(): Promise<HomePagePayload> {
  const settingRows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const r of settingRows) map[r.key] = r.value;

  const [productCount, partnerCount, partners, products, allCategories, homePage] = await Promise.all([
      prisma.product.count({ where: catalogProductWhere() }),
      prisma.partner.count(),
      prisma.partner.findMany({ orderBy: [{ sortOrder: "asc" }], take: 24 }),
      prisma.product.findMany({
        where: { ...catalogProductWhere(), isFeatured: true },
        take: HOME_FEATURED_PRODUCTS_LIMIT,
        orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      }),
      prisma.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] }),
      prisma.page.findFirst({ where: { slug: "home", published: true }, select: { bodyHtml: true } }),
    ]);

  const byParent = new Map<string | null, typeof allCategories>();
  for (const c of allCategories) {
    const k = c.parentId;
    if (!byParent.has(k)) byParent.set(k, []);
    byParent.get(k)!.push(c);
  }
  function buildTree(parentId: string | null): HomePagePayload["categories"] {
    return (byParent.get(parentId) ?? []).map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      children: buildTree(c.id),
    }));
  }

  const catalogRoots = pickCatalogRootSections(
    buildTree(null).filter((category) => CATALOG_ROOT_SLUGS.has(category.slug)),
  );

  const partnerRows =
    partners.length > 0
      ? partners
      : DEFAULT_PARTNER_NAMES.map((name: string) => ({ name, logoPath: null, url: null }));

  return {
    hero: {
      eyebrow: setting(map, "hero_eyebrow", HERO_DEFAULTS.hero_eyebrow),
      h1: setting(map, "hero_h1", HERO_DEFAULTS.hero_h1),
      lead: setting(map, "hero_lead", HERO_DEFAULTS.hero_lead),
      badge: setting(map, "hero_badge", HERO_DEFAULTS.hero_badge),
      imageUrl: map.hero_image?.trim() || null,
      videoUrl: map.hero_video_url?.trim() || null,
      cards: [
        {
          title: setting(map, "hero_card_1_title", HERO_DEFAULTS.hero_card_1_title),
          text: setting(map, "hero_card_1_text", HERO_DEFAULTS.hero_card_1_text),
        },
        {
          title: setting(map, "hero_card_2_title", HERO_DEFAULTS.hero_card_2_title),
          text: setting(map, "hero_card_2_text", HERO_DEFAULTS.hero_card_2_text),
        },
        {
          title: setting(map, "hero_card_3_title", HERO_DEFAULTS.hero_card_3_title),
          text: setting(map, "hero_card_3_text", HERO_DEFAULTS.hero_card_3_text),
        },
      ],
    },
    aboutTeaser: setting(map, "about_teaser", HERO_DEFAULTS.about_teaser),
    aboutHtml: homePage?.bodyHtml?.length && homePage.bodyHtml.length >= 40 ? homePage.bodyHtml : null,
    cta: {
      title: setting(map, "cta_title", HERO_DEFAULTS.cta_title),
      lead: setting(map, "cta_lead", HERO_DEFAULTS.cta_lead),
    },
    workflow: parseWorkflow(map),
    stats: {
      years: parsePositiveInt(map.stats_years, Math.max(1, new Date().getFullYear() - FOUNDED_YEAR)),
      projects: parsePositiveInt(map.stats_projects, 500),
      brands: parsePositiveInt(map.stats_brands, partnerCount),
      productCount,
    },
    categories: catalogRoots,
    products: products.map((p) => ({
      id: p.id,
      slug: p.slug,
      sku: p.sku,
      name: p.name,
      brand: p.brand || undefined,
      stockStatus: p.stockStatus,
      shortDescription: p.shortDescription?.trim() || null,
      discountPercent: p.discountPercent?.toString() ?? null,
      priceRetail: String(p.priceRetail),
      priceFinal: effectivePriceRetail(p.priceRetail.toString(), p.discountPercent?.toString()),
      images: p.images.map((i) => ({ path: i.path })),
    })),
    partners: enrichPartners(partnerRows),
    promo: parseHomePromo(map),
  };
}

/** Настройки сайта для шапки и подвала (серверный layout). */
export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};
  for (const r of rows) map[r.key] = r.value;
  return map;
}
