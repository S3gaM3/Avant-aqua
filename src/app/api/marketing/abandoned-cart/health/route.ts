import { jsonOk } from "@/lib/api-response";
import { getAbandonedCartWebhookConfig } from "@/lib/env";

export async function GET() {
  const cfg = getAbandonedCartWebhookConfig();
  return jsonOk({
    ok: true,
    feature: "abandoned-cart-webhook",
    configured: Boolean(cfg.url),
    provider: cfg.provider,
    hasToken: Boolean(cfg.token),
    endpoint: cfg.url ? "configured" : "missing",
  });
}
