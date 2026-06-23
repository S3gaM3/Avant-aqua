/** PNG-иконки из `public/icons` (макет 1x). */
export const BRAND_ICONS = {
  "phone-white": "/icons/phone-white.png",
  "phone-topbar": "/icons/phone-topbar.png",
  "mail-white": "/icons/mail-white.png",
  "schedule-white": "/icons/schedule-white.png",
  "quality-white": "/icons/quality-white.png",
  "map-white": "/icons/map-white.png",
  search: "/icons/search.png",
  account: "/icons/account.png",
  cart: "/icons/cart.png",
  swimmer: "/icons/swimmer.png",
  "swimmer-lg": "/icons/swimmer-lg.png",
  "swimmer-white": "/icons/swimmer-white.png",
  spa: "/icons/spa.png",
  droplet: "/icons/droplet.png",
  "droplet-blue": "/icons/droplet-blue.png",
  ozone: "/icons/ozone.png",
  "ozone-white": "/icons/ozone-white.png",
  chain: "/icons/chain.png",
  "chain-white": "/icons/chain-white.png",
  conversation: "/icons/conversation.png",
  calendar: "/icons/calendar.png",
  motor: "/icons/motor.png",
  worker: "/icons/worker.png",
  pool: "/icons/pool.png",
  discount: "/icons/discount.png",
} as const;

export type BrandIconKey = keyof typeof BRAND_ICONS;

export const CONTACT_CHANNEL_BRAND_ICONS = {
  phone: "phone-white",
  mail: "mail-white",
  schedule: "schedule-white",
  office: "map-white",
} as const satisfies Record<string, BrandIconKey>;

export const HEADER_BRAND_ICONS = {
  search: "search",
  account: "account",
  cart: "cart",
} as const satisfies Record<string, BrandIconKey>;

/** Иконки направлений в блоке «О компании» на главной (синие на белом фоне). */
export const ABOUT_DIRECTION_BRAND_ICONS: BrandIconKey[] = [
  "swimmer",
  "droplet-blue",
  "ozone",
  "chain",
];

/** Иконки карточек в hero-блоке. */
export const HERO_CARD_BRAND_ICONS: BrandIconKey[] = [
  "swimmer-white",
  "chain-white",
  "quality-white",
];

/** Иконки этапов «Маршрут заказа» на главной. */
export const ROADMAP_STEP_BRAND_ICONS: BrandIconKey[] = [
  "conversation",
  "calendar",
  "motor",
  "worker",
];

const ROOT_CATEGORY_BRAND_ICONS: Record<string, BrandIconKey> = {
  "dlya-bassejnov": "swimmer-lg",
  "dlya-spa": "spa",
  "pitevaya-vodopodgotovka": "droplet-blue",
};

export function rootCategoryBrandIcon(slug: string): BrandIconKey | null {
  return ROOT_CATEGORY_BRAND_ICONS[slug] ?? null;
}
