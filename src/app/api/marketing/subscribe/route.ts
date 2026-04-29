import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { applyRussianNbsp } from "@/lib/ru-typography";

export async function POST(request: Request) {
  const body = await parseJsonBody<{ email?: string }>(request);
  if (!body) {
    return jsonError(applyRussianNbsp("Ошибка подписки"), 400);
  }
  const email = body.email?.trim() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonError(applyRussianNbsp("Некорректный email"), 400);
  }
  return jsonOk({ ok: true, message: applyRussianNbsp("Подписка оформлена") });
}
