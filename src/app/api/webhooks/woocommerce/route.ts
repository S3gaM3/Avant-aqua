import { createHmac, timingSafeEqual } from "node:crypto";
import { fetchWithTimeout, jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

export async function POST(request: Request) {
  const rawBody = await request.text();
  const secret = request.headers.get("x-wc-webhook-secret");
  if (process.env.WC_WEBHOOK_SECRET && secret !== process.env.WC_WEBHOOK_SECRET) {
    return jsonError("Unauthorized", 401);
  }

  // Validate Woo signature if header exists.
  const signature = request.headers.get("x-wc-webhook-signature");
  if (signature && process.env.WC_WEBHOOK_SECRET) {
    const expected = createHmac("sha256", process.env.WC_WEBHOOK_SECRET)
      .update(rawBody, "utf8")
      .digest("base64");
    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return jsonError("Invalid signature", 401);
    }
  }

  const payload =
    (await parseJsonBody<{
      id?: number;
      product_id?: number;
      category_slug?: string;
    }>(new Request(request.url, { method: "POST", body: rawBody, headers: request.headers }))) ??
    {};
  const topic = request.headers.get("x-wc-webhook-topic") ?? "";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  if (process.env.REVALIDATE_TOKEN) {
    await fetchWithTimeout(`${site}/api/revalidate`, {
      method: "POST",
      timeoutMs: 6000,
      headers: {
        "Content-Type": "application/json",
        "x-revalidate-token": process.env.REVALIDATE_TOKEN,
      },
      body: JSON.stringify({
        path: "/catalog",
        tags: ["products", "categories"],
      }),
    }).catch((error) => {
      console.error("[api/webhooks/woocommerce] revalidate failed", error);
    });
  }

  const productId = payload.product_id ?? payload.id;
  if (
    process.env.MEILISEARCH_REINDEX_TOKEN &&
    /product/i.test(topic) &&
    typeof productId === "number"
  ) {
    const indexEndpoint = /deleted|trashed|removed/i.test(topic)
      ? "/api/search/index/delete"
      : "/api/search/index/sync";
    await fetchWithTimeout(`${site}${indexEndpoint}`, {
      method: "POST",
      timeoutMs: 6000,
      headers: {
        "Content-Type": "application/json",
        "x-search-index-token": process.env.MEILISEARCH_REINDEX_TOKEN,
      },
      body: JSON.stringify({ productId }),
    }).catch((error) => {
      console.error("[api/webhooks/woocommerce] search sync failed", error);
    });
  } else if (
    process.env.MEILISEARCH_REINDEX_TOKEN &&
    /category/i.test(topic) &&
    typeof payload.category_slug === "string"
  ) {
    await fetchWithTimeout(`${site}/api/search/index/sync`, {
      method: "POST",
      timeoutMs: 6000,
      headers: {
        "Content-Type": "application/json",
        "x-search-index-token": process.env.MEILISEARCH_REINDEX_TOKEN,
      },
      body: JSON.stringify({ categorySlug: payload.category_slug }),
    }).catch((error) => {
      console.error("[api/webhooks/woocommerce] category sync failed", error);
    });
  }

  return jsonOk({ ok: true });
}
