import { getSearchIndexRebuildToken } from "@/lib/env";
import { upsertProductsMeilisearch } from "@/lib/meilisearch";
import { fetchProducts } from "@/lib/woocommerce";
import { jsonError, jsonOk } from "@/lib/api-response";

export async function POST(request: Request) {
  const expected = getSearchIndexRebuildToken();
  if (!expected) {
    return jsonError("MEILISEARCH_REINDEX_TOKEN is not configured", 400);
  }

  const auth = request.headers.get("x-search-index-token");
  if (auth !== expected) {
    return jsonError("Unauthorized", 401);
  }
  try {
    const products = await fetchProducts({ perPage: 500 });
    const result = await upsertProductsMeilisearch(products);
    if (!result.ok) {
      return jsonError(result.message ?? "Indexing failed", 500);
    }
    return jsonOk({
      ok: true,
      indexed: result.indexed,
      message: "Meilisearch index rebuilt",
    });
  } catch (error) {
    console.error("[api/search/index/rebuild] failed", error);
    return jsonError("Index rebuild failed", 500);
  }
}
