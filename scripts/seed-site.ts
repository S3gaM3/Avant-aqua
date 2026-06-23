/**
 * Начальные настройки сайта, партнёры, демо-новость (после prisma db push).
 */
import "dotenv/config";
import { prisma } from "@avant/db";
import { resolvePartnerLogoPath } from "@avant/shared";

const defaults: Record<string, string> = {
  hero_eyebrow: "Инженерные решения AVANT AQUA",
  hero_h1: "Оборудование для бассейнов и SPA от ведущих производителей",
  hero_lead:
    "Насосы, фильтры, дезинфекция, освещение и комплектующие — подбор, поставка и сервис для частных и коммерческих объектов по всей России.",
  hero_badge: "С 1998 года · ООО «Авант» · Москва",
  hero_card_1_title: "Под ключ",
  hero_card_1_text: "Комплектация объекта от проекта до запуска",
  hero_card_2_title: "5000+ SKU",
  hero_card_2_text: "Актуальный прайс и наличие в каталоге",
  hero_card_3_title: "Бренды",
  hero_card_3_text: "OSF, Filtreau, Bowman и другие производители",
  about_teaser:
    "С 1998 года «Авант» проектирует и поставляет оборудование для бассейнов и SPA-комплексов. Берём на себя полный цикл: подбор решений, комплектацию, запуск и сервисное сопровождение — для частных заказчиков и бизнеса.\n\nОсновной регион работы — Москва и Московская область; выполняем удалённые поставки по всей России. Консультируем по подбору насосов, фильтрации, дезинфекции и автоматики под конкретный объект.\n\nРаботаем с проверенными брендами — OSF, Filtreau, Bowman и другими производителями. Помогаем смонтировать систему «под ключ» или дополнить действующий комплекс запчастями и сервисом.",
  cta_title: "Нужна консультация по подбору оборудования?",
  cta_lead:
    "Оставьте заявку — менеджер перезвонит, уточнит задачу и подготовит коммерческое предложение по каталогу.",
  home_promo_enabled: "1",
  home_promo_badge: "Акция",
  home_promo_title: "Сезонные новинки и спецпредложения",
  home_promo_text: "Актуальные позиции со скидками в каталоге",
  home_promo_href: "/catalog?discount=1",
  home_promo_cta: "Смотреть предложения",
  seo_title: "Оборудование для бассейнов и SPA — AVANT AQUA, Москва",
  seo_description:
    "Насосы, фильтры, дезинфекция и комплектующие для бассейнов, SPA и водоподготовки. Подбор, поставка и сервис с 1998 года. Доставка по России.",
  seo_keywords:
    "оборудование для бассейнов, насос для бассейна, фильтр для бассейна, оборудование для SPA, водоподготовка, теплообменник для бассейна, станция дозирования, химия для бассейна, комплектующие для бассейна, купить оборудование для бассейна Москва, OSF, Filtreau, Bowman, AVANT AQUA, Авант",
  seo_title_template: "%s | AVANT AQUA",
  seo_og_image: "",
  seo_home_title: "Оборудование для бассейнов и SPA — каталог AVANT AQUA",
  seo_home_description:
    "Каталог 2400+ позиций с ценами: насосы, фильтры, дезинфекция, освещение. Бренды OSF, Filtreau, Bowman. Подбор и КП с 1998 года. Москва, доставка по России.",
  contact_phone: "+7 (919) 105-38-53",
  contact_email: "avanttec@yandex.ru",
  contact_address: "125424, г. Москва, Волоколамское шоссе д. 73, офис 518",
};

async function main() {
  for (const [key, value] of Object.entries(defaults)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  const partners: { name: string; url: string | null }[] = [
    { name: "KAUFMANN", url: "https://www.kaufmanntec.ru/" },
    { name: "SEWEC", url: "https://www.sewec-ozon.de/en/home" },
    { name: "IML", url: "https://www.imlmanuals.com/en.html" },
    { name: "GEMAŞ", url: "https://gemas.com.tr/en" },
    { name: "OSF", url: "https://www.osf.de/" },
    { name: "FILTREAU", url: "https://www.filtreau.com/" },
    { name: "MAX DAPRA", url: "https://www.maxdapra.com/" },
    { name: "BIO UV", url: "https://www.bio-uv.com/" },
    { name: "STEIEL", url: "https://www.steiel.it/en/" },
    { name: "BOWMAN", url: "https://www.bowman-heatexchangers.co.uk/" },
  ];
  await prisma.partner.deleteMany({});
  for (let j = 0; j < partners.length; j++) {
    const { name, url } = partners[j]!;
    await prisma.partner.create({
      data: {
        name,
        url,
        logoPath: resolvePartnerLogoPath(name, null),
        sortOrder: j,
      },
    });
  }

  await prisma.newsPost.upsert({
    where: { slug: "demo-novost" },
    create: {
      slug: "demo-novost",
      title: "Добро пожаловать на новый сайт",
      excerpt: "Каталог синхронизируется с прайс-листом и внешними источниками.",
      bodyHtml: "<p>Замените эту новость после импорта контента из WordPress.</p>",
      dateLabel: new Date().toLocaleDateString("ru-RU"),
      published: true,
      sortOrder: 0,
    },
    update: {
      title: "Добро пожаловать на новый сайт",
    },
  });

  // eslint-disable-next-line no-console
  console.log("seed-site готово");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
