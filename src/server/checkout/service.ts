import type { CheckoutBridgePayload } from "@/lib/checkout";
import { syncCartToWooCommerce } from "@/server/checkout/integrations";

export async function createCheckoutRedirect(payload: CheckoutBridgePayload): Promise<{
  checkoutUrl: string;
  mode: "stub" | "live";
}> {
  return syncCartToWooCommerce(payload);
}
