import { revalidatePath, revalidateTag } from "next/cache";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

const MAX_TAGS = 30;
const MAX_PATH_LENGTH = 256;

export async function GET() {
  return jsonOk({
    ok: true,
    feature: "revalidate",
    configured: Boolean(process.env.REVALIDATE_TOKEN),
  });
}

export async function POST(request: Request) {
  const auth = request.headers.get("x-revalidate-token");
  if (!process.env.REVALIDATE_TOKEN || auth !== process.env.REVALIDATE_TOKEN) {
    return jsonError("Unauthorized", 401);
  }

  const body =
    (await parseJsonBody<{
      path?: string;
      tags?: string[];
    }>(request)) ?? {};

  if (body.path) {
    const cleanPath = body.path.trim();
    if (!cleanPath.startsWith("/") || cleanPath.length > MAX_PATH_LENGTH) {
      return jsonError("Invalid path", 400);
    }
    revalidatePath(cleanPath);
  }

  const tags = (body.tags ?? [])
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
    .slice(0, MAX_TAGS);

  for (const tag of tags) revalidateTag(tag, "max");
  return jsonOk({ ok: true, revalidated: true, path: body.path ?? null, tags });
}
