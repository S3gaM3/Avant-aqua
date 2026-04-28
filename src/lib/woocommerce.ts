import { getWooCommerceCredentials, getWordPressUrl } from "@/lib/env";
import { hasDisplayPrice } from "@/lib/format";
import {
  fetchCategoriesGraphql,
  fetchProductBySlugGraphql,
  fetchProductsGraphql,
} from "@/lib/graphql-commerce";
import type { Product, ProductCategory } from "@/lib/types/commerce";
import { mockCategories, mockProducts } from "@/data/mock-catalog";
import type { CreateOrderPayload } from "@/lib/checkout-order";

const API = "/wp-json/wc/v3";
const STORE_API = "/wp-json/wc/store/v1";

function wooUrl(pathWithQuery: string): string {
  const base = getWordPressUrl();
  const c = getWooCommerceCredentials();
  if (!base || !c) throw new Error("WooCommerce not configured");
  const sep = pathWithQuery.includes("?") ? "&" : "?";
  const q = new URLSearchParams({
    consumer_key: c.key,
    consumer_secret: c.secret,
  });
  return `${base}${API}${pathWithQuery}${sep}${q.toString()}`;
}

function storeUrl(pathWithQuery: string): string {
  const base = getWordPressUrl();
  if (!base) throw new Error("WordPress is not configured");
  return `${base}${STORE_API}${pathWithQuery}`;
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSlug(value: string): string {
  return safeDecode(value).trim().toLowerCase();
}

function toMajorPrice(value: string, minorUnit = 2): string {
  const n = Number(value);
  if (Number.isNaN(n)) return "0";
  return (n / Math.pow(10, minorUnit)).toString();
}

type StoreCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
};

type WcV3Category = {
  id: number;
  name: string;
  slug: string;
  parent?: number;
  count?: number;
};

type StoreProduct = {
  id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string;
  description: string;
  permalink: string;
  images: { id: number; src: string; alt: string }[];
  categories: { id: number; name: string; slug: string }[];
  attributes?: { name: string; terms?: string[]; options?: string[] }[];
  prices: {
    price: string;
    regular_price: string;
    sale_price: string;
    currency_minor_unit: number;
  };
  is_in_stock: boolean;
};

function sanitizeProductName(value: string): string {
  return value
    .replace(/\s*\(?(?:поз\.?\s*\d+)\)?/gi, "")
    .replace(/\s*стр\.?\s*\d+/gi, "")
    .replace(/\.(jpg|jpeg|png|webp)$/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

const categoryBasePrice: Array<{ slug: string; price: number }> = [
  { slug: "nasosy", price: 97500 },
  { slug: "filtry-pesochnye", price: 149000 },
  { slug: "dlya-spa", price: 84500 },
  { slug: "truby-i-fitingi", price: 12500 },
  { slug: "pitevaya-vodopodgotovka", price: 68900 },
  { slug: "dlya-basseynov", price: 75900 },
];

function derivePriceByCategory(product: Product): number {
  for (const category of product.categories) {
    const matched = categoryBasePrice.find((item) => item.slug === category.slug);
    if (matched) return matched.price;
  }
  return 59900;
}

function roundPrice(value: number): number {
  return Math.round(value / 500) * 500;
}

function ensureProductPrice(product: Product): Product {
  if (hasDisplayPrice(product.price)) {
    return product;
  }

  const base = derivePriceByCategory(product);
  const spread = (product.id % 11) * 1500;
  const fallback = roundPrice(base + spread).toString();

  return {
    ...product,
    price: fallback,
    regular_price: fallback,
    sale_price:
      product.sale_price && hasDisplayPrice(product.sale_price) ? product.sale_price : fallback,
  };
}

function normalizeProduct(product: Product): Product {
  return ensureProductPrice({
    ...product,
    name: sanitizeProductName(product.name),
  });
}

function mapStoreProduct(p: StoreProduct): Product {
  const minor = p.prices?.currency_minor_unit ?? 2;
  const price = toMajorPrice(p.prices?.price ?? "0", minor);
  const regular = toMajorPrice(p.prices?.regular_price ?? p.prices?.price ?? "0", minor);
  const sale = toMajorPrice(p.prices?.sale_price ?? p.prices?.price ?? "0", minor);
  const mapped: Product = {
    id: p.id,
    name: sanitizeProductName(p.name),
    slug: safeDecode(p.slug),
    sku: p.sku ?? "",
    price,
    regular_price: regular,
    sale_price: sale,
    short_description: p.short_description ?? "",
    description: p.description ?? "",
    permalink: p.permalink,
    images: (p.images ?? []).map((img) => ({
      id: img.id,
      src: encodeURI(img.src),
      alt: img.alt ?? p.name,
    })),
    categories: p.categories ?? [],
    attributes: (p.attributes ?? []).map((a) => ({
      name: a.name,
      options: a.options ?? a.terms ?? [],
    })),
    stock_status: p.is_in_stock ? "instock" : "outofstock",
  };
  return ensureProductPrice(mapped);
}

async function fetchStoreCategories(params?: { hideEmpty?: boolean }): Promise<ProductCategory[]> {
  const hide = params?.hideEmpty ? "&hide_empty=true" : "";
  const url = storeUrl(`/products/categories?per_page=100${hide}`);
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const categories = (await res.json()) as StoreCategory[];
  return categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: safeDecode(c.slug),
    parent: c.parent,
    count: c.count,
  }));
}

function mapCategorySlug<T extends { slug: string }>(item: T): T {
  return {
    ...item,
    slug: safeDecode(item.slug),
  };
}

async function fetchStoreProducts(options?: {
  category?: string;
  page?: number;
  perPage?: number;
}): Promise<Product[]> {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 12;
  let path = `/products?page=${page}&per_page=${perPage}`;
  if (options?.category) {
    path += `&category=${encodeURIComponent(options.category)}`;
  }
  const url = storeUrl(path);
  const res = await fetch(url, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return [];
  const list = (await res.json()) as StoreProduct[];
  return list.map(mapStoreProduct);
}

async function fetchStoreProductBySlug(slug: string): Promise<Product | null> {
  const directUrl = storeUrl(`/products?slug=${encodeURIComponent(slug)}&per_page=1`);
  const directRes = await fetch(directUrl, {
    next: { revalidate: 3600 },
    headers: { Accept: "application/json" },
  });
  if (!directRes.ok) return null;
  const directList = (await directRes.json()) as StoreProduct[];
  if (directList.length > 0) return mapStoreProduct(directList[0]);
  return null;
}

export async function fetchProductCategories(params?: {
  hideEmpty?: boolean;
}): Promise<ProductCategory[]> {
  if (!getWordPressUrl()) return mockCategories;
  const gqlCategories = await fetchCategoriesGraphql();
  if (gqlCategories && gqlCategories.length > 0) {
    if (params?.hideEmpty) return gqlCategories.filter((c) => (c.count ?? 0) > 0);
    return gqlCategories;
  }
  const hide = params?.hideEmpty ? "&hide_empty=true" : "";
  try {
    const url = wooUrl(`/products/categories?per_page=100${hide}`);
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const fallback = await fetchStoreCategories(params);
      return fallback;
    }
    const categories = (await res.json()) as WcV3Category[];
    return categories.map((c) => mapCategorySlug(c));
  } catch {
    try {
      const fallback = await fetchStoreCategories(params);
      return fallback;
    } catch {
      return [];
    }
  }
}

async function resolveCategoryId(slug: string): Promise<number | undefined> {
  const cats = await fetchProductCategories();
  return cats.find((c) => c.slug === slug)?.id;
}

export async function fetchProducts(options?: {
  category?: string;
  page?: number;
  perPage?: number;
}): Promise<Product[]> {
  if (!getWordPressUrl()) {
    let list = [...mockProducts];
    if (options?.category) {
      list = list.filter((p) => p.categories.some((c) => c.slug === options.category));
    }
    return list;
  }
  const gqlProducts = await fetchProductsGraphql({
    category: options?.category,
    perPage: options?.perPage ?? 24,
  });
  if (gqlProducts && gqlProducts.length > 0) {
    return gqlProducts.map(normalizeProduct);
  }
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 12;
  let path = `/products?page=${page}&per_page=${perPage}&status=publish`;
  if (options?.category) {
    const catId = await resolveCategoryId(options.category);
    if (catId) path += `&category=${catId}`;
  }
  try {
    const url = wooUrl(path);
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const fallback = await fetchStoreProducts(options);
      return fallback;
    }
    const list = (await res.json()) as Product[];
    return list.map(normalizeProduct);
  } catch {
    try {
      const fallback = await fetchStoreProducts(options);
      return fallback;
    } catch {
      return [];
    }
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  if (!getWordPressUrl()) {
    return mockProducts.find((p) => p.slug === slug) ?? null;
  }
  const gqlProduct = await fetchProductBySlugGraphql(slug);
  if (gqlProduct) return normalizeProduct(gqlProduct);
  try {
    const url = wooUrl(`/products?slug=${encodeURIComponent(slug)}`);
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const direct = await fetchStoreProductBySlug(slug);
      if (direct) return direct;
      const fallback = await fetchStoreProducts({ perPage: 100 });
      const wanted = normalizeSlug(slug);
      return fallback.find((p) => normalizeSlug(p.slug) === wanted) ?? null;
    }
    const list = (await res.json()) as Product[];
    return list[0] ? normalizeProduct(list[0]) : null;
  } catch {
    try {
      const direct = await fetchStoreProductBySlug(slug);
      if (direct) return direct;
      const fallback = await fetchStoreProducts({ perPage: 100 });
      const wanted = normalizeSlug(slug);
      return fallback.find((p) => normalizeSlug(p.slug) === wanted) ?? null;
    } catch {
      return null;
    }
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  if (!getWordPressUrl()) {
    return mockProducts.find((p) => p.id === id) ?? null;
  }
  try {
    const url = wooUrl(`/products/${id}`);
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      const fallback = await fetchStoreProducts({ perPage: 100 });
      return fallback.find((p) => p.id === id) ?? null;
    }
    const product = (await res.json()) as Product;
    return normalizeProduct(product);
  } catch {
    try {
      const fallback = await fetchStoreProducts({ perPage: 100 });
      return fallback.find((p) => p.id === id) ?? null;
    } catch {
      return null;
    }
  }
}

type WooOrderResponse = {
  id: number;
  order_key: string;
  payment_url?: string;
  checkout_payment_url?: string;
};

function resolveOrderPaymentUrl(order: WooOrderResponse): string | null {
  if (order.checkout_payment_url) return order.checkout_payment_url;
  if (order.payment_url) return order.payment_url;
  const base = getWordPressUrl();
  if (!base) return null;
  return `${base}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;
}

export async function createWooOrder(payload: CreateOrderPayload): Promise<{
  orderId: number;
  paymentUrl: string | null;
}> {
  const url = wooUrl("/orders");
  const billing = {
    first_name: payload.customer.firstName.trim(),
    last_name: payload.customer.lastName.trim(),
    address_1: payload.customer.address1.trim(),
    city: payload.customer.city.trim(),
    postcode: payload.customer.postcode.trim(),
    country: "RU",
    email: payload.customer.email.trim(),
    phone: payload.customer.phone.trim(),
  };

  const response = await fetch(url, {
    method: "POST",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      set_paid: false,
      payment_method: "bacs",
      payment_method_title: "Оплата после подтверждения",
      customer_note: payload.customer.comment.trim(),
      billing,
      shipping: billing,
      line_items: payload.lines.map((line) => ({
        product_id: line.productId,
        quantity: line.quantity,
      })),
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to create WooCommerce order");
  }

  const order = (await response.json()) as WooOrderResponse;
  return {
    orderId: order.id,
    paymentUrl: resolveOrderPaymentUrl(order),
  };
}
