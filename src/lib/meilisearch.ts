import { getMeilisearchConfig } from "@/lib/env";
import type { Product } from "@/lib/types/commerce";

export type MeiliProductHit = {
  id: number;
  slug: string;
  name: string;
  price: string;
  image: string | null;
};

export type MeiliIndexResult = {
  ok: boolean;
  indexed: number;
  message?: string;
};

type MeiliResponse = {
  hits?: Array<{
    id?: number;
    slug?: string;
    name?: string;
    price?: string | number;
    image?: string | null;
  }>;
};

export async function searchProductsMeilisearch(
  query: string,
  limit = 8,
): Promise<MeiliProductHit[]> {
  const cfg = getMeilisearchConfig();
  if (!cfg.url || !query.trim()) return [];
  try {
    const endpoint = `${cfg.url.replace(/\/+$/, "")}/indexes/${encodeURIComponent(cfg.index)}/search`;
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      body: JSON.stringify({
        q: query,
        limit,
        attributesToRetrieve: ["id", "slug", "name", "price", "image"],
      }),
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as MeiliResponse;
    return (data.hits ?? [])
      .filter((h) => typeof h.id === "number" && typeof h.slug === "string")
      .map((h) => ({
        id: h.id as number,
        slug: h.slug as string,
        name: h.name ?? "Товар",
        price: String(h.price ?? "0"),
        image: h.image ?? null,
      }));
  } catch {
    return [];
  }
}

export async function upsertProductsMeilisearch(products: Product[]): Promise<MeiliIndexResult> {
  const cfg = getMeilisearchConfig();
  if (!cfg.url) {
    return { ok: false, indexed: 0, message: "Meilisearch URL is not configured" };
  }
  try {
    const base = cfg.url.replace(/\/+$/, "");
    const indexPath = `${base}/indexes/${encodeURIComponent(cfg.index)}`;
    const headers = {
      "Content-Type": "application/json",
      ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
    };

    await fetch(indexPath, {
      method: "POST",
      headers,
      body: JSON.stringify({ uid: cfg.index, primaryKey: "id" }),
      cache: "no-store",
    }).catch(() => null);

    const docs = products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images[0]?.src ?? null,
      stock_status: p.stock_status,
      categories: p.categories.map((c) => c.name),
      category_slugs: p.categories.map((c) => c.slug),
    }));

    const response = await fetch(`${indexPath}/documents?primaryKey=id`, {
      method: "POST",
      headers,
      body: JSON.stringify(docs),
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, indexed: 0, message: "Failed to upsert Meilisearch documents" };
    }

    await fetch(`${indexPath}/settings/searchable-attributes`, {
      method: "PUT",
      headers,
      body: JSON.stringify(["name", "categories", "slug", "category_slugs"]),
      cache: "no-store",
    }).catch(() => null);

    return { ok: true, indexed: docs.length };
  } catch {
    return { ok: false, indexed: 0, message: "Unexpected Meilisearch indexing error" };
  }
}

export async function deleteProductMeilisearch(productId: number): Promise<MeiliIndexResult> {
  const cfg = getMeilisearchConfig();
  if (!cfg.url) {
    return { ok: false, indexed: 0, message: "Meilisearch URL is not configured" };
  }
  try {
    const base = cfg.url.replace(/\/+$/, "");
    const indexPath = `${base}/indexes/${encodeURIComponent(cfg.index)}`;
    const response = await fetch(`${indexPath}/documents/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(cfg.apiKey ? { Authorization: `Bearer ${cfg.apiKey}` } : {}),
      },
      cache: "no-store",
    });
    if (!response.ok) {
      return { ok: false, indexed: 0, message: "Failed to delete Meilisearch document" };
    }
    return { ok: true, indexed: 1 };
  } catch {
    return { ok: false, indexed: 0, message: "Unexpected Meilisearch delete error" };
  }
}
