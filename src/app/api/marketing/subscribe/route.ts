import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

export async function POST(request: Request) {
  const body = await parseJsonBody<{ email?: string }>(request);
  if (!body) {
    return jsonError("Ошибка подписки", 400);
  }
  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError("Некорректный email", 400);
  }
  return jsonOk({ ok: true, message: "Подписка оформлена" });
}
