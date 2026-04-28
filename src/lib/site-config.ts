export const siteConfig = {
  name: "ООО «Авант»",
  shortName: "Авант",
  tagline: "Технологии очистки воды",
  description:
    "Подбор и поставка оборудования для бассейнов и СПА, питьевая водоподготовка, монтаж и сервис. Работаем с 1998 года.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://avant-aqua.ru",
  phoneDisplay: "+7 (919) 105-38-53",
  phoneTel: "+79191053853",
  email: "avanttec@yandex.ru",
  address: "125424, г.\u00A0Москва, Волоколамское шоссе, д.\u00A073, оф.\u00A0518",
  legacySiteUrl: "https://avant-aqua.ru",
} as const;
