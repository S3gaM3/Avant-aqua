import { NextResponse } from "next/server";
import { getSearchIndexRebuildToken } from "@/lib/env";
import { deleteProductMeilisearch } from "@/lib/meilisearch";

type DeletePayload = {
  productId?: number;
};

export async function POST(request: Request) {
  const expected = getSearchIndexRebuildToken();
  if (!expected) {
    return NextResponse.json(
      { ok: false, message: "MEILISEARCH_REINDEX_TOKEN is not configured" },
      { status: 400 },
    );
  }
  const auth = request.headers.get("x-search-index-token");
  if (auth !== expected) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as DeletePayload;
  if (typeof body.productId !== "number" || !Number.isFinite(body.productId)) {
    return NextResponse.json({ ok: false, message: "Provide productId" }, { status: 400 });
  }

  const result = await deleteProductMeilisearch(body.productId);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, message: result.message ?? "Delete failed" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    deleted: body.productId,
    message: "Meilisearch document deleted",
  });
}
