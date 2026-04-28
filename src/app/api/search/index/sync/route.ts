import { getSearchIndexRebuildToken } from "@/lib/env";
import { upsertProductsMeilisearch } from "@/lib/meilisearch";
import { fetchProductById, fetchProducts } from "@/lib/woocommerce";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

type SyncPayload = {
  productId?: number;
  categorySlug?: string;
};

export async function POST(request: Request) {
  const expected = getSearchIndexRebuildToken();
  if (!expected) {
    return jsonError("MEILISEARCH_REINDEX_TOKEN is not configured", 400);
  }
  const auth = request.headers.get("x-search-index-token");
  if (auth !== expected) {
    return jsonError("Unauthorized", 401);
  }

  const body = (await parseJsonBody<SyncPayload>(request)) ?? {};
  let products = [] as Awaited<ReturnType<typeof fetchProducts>>;

  try {
    if (typeof body.productId === "number" && Number.isFinite(body.productId)) {
      const product = await fetchProductById(body.productId);
      products = product ? [product] : [];
    } else if (typeof body.categorySlug === "string" && body.categorySlug.trim()) {
      products = await fetchProducts({ category: body.categorySlug.trim(), perPage: 500 });
    } else {
      return jsonError("Provide productId or categorySlug", 400);
    }

    if (products.length === 0) {
      return jsonOk({
        ok: true,
        indexed: 0,
        message: "Nothing to index for provided payload",
      });
    }

    const result = await upsertProductsMeilisearch(products);
    if (!result.ok) {
      return jsonError(result.message ?? "Indexing failed", 500);
    }

    return jsonOk({
      ok: true,
      indexed: result.indexed,
      message: "Meilisearch incremental sync completed",
    });
  } catch (error) {
    console.error("[api/search/index/sync] failed", error);
    return jsonError("Index sync failed", 500);
  }
}
