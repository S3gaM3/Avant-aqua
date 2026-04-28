import { NextResponse } from "next/server";
import { fetchProducts } from "@/lib/woocommerce";
import { fetchProductCategories } from "@/lib/woocommerce";
import { searchProductsGraphql } from "@/lib/graphql-commerce";
import { searchProductsMeilisearch } from "@/lib/meilisearch";
import { cacheGet, cacheSet } from "@/lib/server-cache";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get("q") ?? "").trim();
  if (!query) return NextResponse.json({ items: [] });
  const key = `search:${query.toLowerCase()}`;
  const cached = cacheGet<{ items: unknown[]; categories: unknown[]; source: string }>(key);
  if (cached) return NextResponse.json(cached);

  const categories = (await fetchProductCategories({ hideEmpty: true }))
    .filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
    }));

  const meili = await searchProductsMeilisearch(query, 8);
  if (meili.length > 0) {
    return NextResponse.json(cacheSet(key, { items: meili, categories, source: "meilisearch" }));
  }

  const gql = await searchProductsGraphql(query, 8);
  if (gql.length > 0) {
    return NextResponse.json(cacheSet(key, { items: gql, categories, source: "graphql" }));
  }

  const fallback = await fetchProducts({ perPage: 80 });
  const items = fallback
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 8)
    .map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      image: p.images[0]?.src ?? null,
    }));
  return NextResponse.json(cacheSet(key, { items, categories, source: "fallback" }));
}
