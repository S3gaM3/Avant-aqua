import { fetchWithTimeout, jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";
import { getAbandonedCartWebhookConfig } from "@/lib/env";
import { buildAbandonedCartPayload } from "@/lib/marketing/abandoned-cart-provider";

type AbandonedCartPayload = {
  email?: string;
  total?: number;
  currency?: string;
  items?: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
};

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 8;
const rateBucket = new Map<string, number[]>();

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getClientIp(request: Request): string {
  const h = request.headers;
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

function isRateLimited(key: string, now = Date.now()): boolean {
  const history = rateBucket.get(key) ?? [];
  const fresh = history.filter((ts) => now - ts < RATE_WINDOW_MS);
  if (fresh.length >= RATE_LIMIT_MAX) {
    rateBucket.set(key, fresh);
    return true;
  }
  fresh.push(now);
  rateBucket.set(key, fresh);
  return false;
}

export async function POST(request: Request) {
  try {
    const body = await parseJsonBody<AbandonedCartPayload>(request);
    if (!body) return jsonError("Ошибка обработки корзины", 400);
    const email = body.email?.trim().toLowerCase() ?? "";
    if (!isValidEmail(email)) {
      return jsonError("Некорректный email", 400);
    }
    const ip = getClientIp(request);
    if (isRateLimited(`${ip}:${email}`)) {
      return jsonError("Слишком много запросов. Попробуйте позже.", 429);
    }

    const items = Array.isArray(body.items) ? body.items : [];
    const total = Number(body.total ?? 0);
    const currency = body.currency ?? "RUB";

    const webhook = getAbandonedCartWebhookConfig();
    if (webhook.url) {
      try {
        const payload = buildAbandonedCartPayload(webhook.provider, {
          email,
          total,
          currency,
          items,
          capturedAt: new Date().toISOString(),
        });
        await fetchWithTimeout(webhook.url, {
          method: "POST",
          timeoutMs: 7000,
          headers: {
            "Content-Type": "application/json",
            ...(webhook.token ? { Authorization: `Bearer ${webhook.token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      } catch (error) {
        console.error("[api/marketing/abandoned-cart] webhook push failed", error);
        // Intentionally swallow webhook errors in MVP mode.
      }
    }

    return jsonOk({
      ok: true,
      message: "Контакт для брошенной корзины сохранен",
    });
  } catch (error) {
    console.error("[api/marketing/abandoned-cart] failed", error);
    return jsonError("Ошибка обработки корзины", 400);
  }
}
