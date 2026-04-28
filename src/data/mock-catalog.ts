import type { Product, ProductCategory } from "@/lib/types/commerce";

/** Локальный каталог для разработки и резервный режим без WooCommerce */
export const mockCategories: ProductCategory[] = [
  { id: 1, name: "Для бассейнов", slug: "dlya-basseynov", count: 12 },
  { id: 2, name: "Насосы", slug: "nasosy", parent: 1, count: 4 },
  { id: 3, name: "Фильтры песочные", slug: "filtry-pesochnye", parent: 1, count: 3 },
  { id: 4, name: "Для СПА", slug: "dlya-spa", count: 6 },
  { id: 5, name: "Питьевая водоподготовка", slug: "pitevaya-vodopodgotovka", count: 8 },
  { id: 6, name: "Трубы и фитинги", slug: "truby-i-fitingi", count: 10 },
];

export const mockProducts: Product[] = [
  {
    id: 101,
    name: "Префильтр PSH чугун/бронза ∅225 × ∅160",
    slug: "prefiltr-psh-225-160",
    sku: "PSH-225-160",
    price: "459000",
    regular_price: "459000",
    short_description:
      "Фланцы по DIN 2501. Корзина AISI\u00A0304. Рабочее давление до 2,0\u00A0кгс/см².",
    description:
      "<p>Надёжный префильтр для защиты насосного оборудования. Подходит для коммерческих и общественных бассейнов.</p>",
    permalink: "/catalog/prefiltr-psh-225-160",
    stock_status: "instock",
    images: [{ id: 1, src: "/images/placeholder-product.svg", alt: "Префильтр PSH" }],
    categories: [
      { id: 1, name: "Для бассейнов", slug: "dlya-basseynov" },
      { id: 3, name: "Фильтры песочные", slug: "filtry-pesochnye" },
    ],
  },
  {
    id: 102,
    name: "Префильтр PSH чугун/бронза ∅110 × ∅75",
    slug: "prefiltr-psh-110-75",
    sku: "PSH-110-75",
    price: "149000",
    regular_price: "149000",
    short_description:
      "Фланцы по DIN 2501. Корзина AISI\u00A0304. Рабочее давление до 2,0\u00A0кгс/см².",
    description: "<p>Компактный префильтр для объектов средней нагрузки.</p>",
    permalink: "/catalog/prefiltr-psh-110-75",
    stock_status: "instock",
    images: [{ id: 2, src: "/images/placeholder-product.svg", alt: "Префильтр PSH" }],
    categories: [
      { id: 1, name: "Для бассейнов", slug: "dlya-basseynov" },
      { id: 3, name: "Фильтры песочные", slug: "filtry-pesochnye" },
    ],
  },
  {
    id: 103,
    name: "Насос циркуляционный серии Aqua Max (пример)",
    slug: "nasos-aqua-max-primer",
    sku: "AMX-100",
    price: "97500",
    regular_price: "97500",
    short_description: "Энергоэффективный насос для фильтрации воды в бассейне.",
    description: "<p>Подбор по напору и расходу выполняют инженеры «Авант» под параметры чаши.</p>",
    permalink: "/catalog/nasos-aqua-max-primer",
    stock_status: "instock",
    images: [{ id: 3, src: "/images/placeholder-product.svg", alt: "Насос" }],
    categories: [{ id: 2, name: "Насосы", slug: "nasosy" }],
  },
];
