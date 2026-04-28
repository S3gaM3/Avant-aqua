import { getWooCommerceCredentials, getWooCommerceCheckoutUrl, getWordPressUrl } from "@/lib/env";
import { jsonOk } from "@/lib/api-response";

export async function GET() {
  const hasWp = Boolean(getWordPressUrl());
  const hasWooApi = Boolean(getWooCommerceCredentials());
  const hasHostedCheckout = Boolean(getWooCommerceCheckoutUrl());

  return jsonOk({
    ok: true,
    feature: "checkout",
    mode: hasWooApi ? "api" : hasHostedCheckout ? "hosted" : "disabled",
    configured: hasWp && (hasWooApi || hasHostedCheckout),
    hasWordPress: hasWp,
    hasWooApi,
    hasHostedCheckout,
  });
}
