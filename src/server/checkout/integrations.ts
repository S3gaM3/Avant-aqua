import { getWooCommerceCheckoutUrl } from "@/lib/env";
import type { CheckoutBridgePayload } from "@/lib/checkout";

function isStubMode() {
  return process.env.WC_BRIDGE_MODE !== "live";
}

export async function syncCartToWooCommerce(
  payload: CheckoutBridgePayload,
): Promise<{ checkoutUrl: string; mode: "stub" | "live" }> {
  const checkoutUrl = getWooCommerceCheckoutUrl();
  if (!checkoutUrl) {
    throw new Error("NEXT_PUBLIC_WC_CHECKOUT_URL is not configured");
  }

  if (isStubMode()) {
    await new Promise((resolve) => setTimeout(resolve, 120));
    const query = new URLSearchParams({
      bridge: "stub",
      items: String(payload.lines.length),
    });
    return { checkoutUrl: `${checkoutUrl}?${query.toString()}`, mode: "stub" };
  }

  // TODO: Подключить реальную синхронизацию корзины с WooCommerce.
  // Варианты:
  // 1) server-to-server запрос в плагин моста (лучший вариант для headless),
  // 2) генерация signed payload/token и разбор на стороне WP.
  // Возвращаемый контракт должен содержать финальный URL checkout для редиректа.
  void payload;
  throw new Error("WooCommerce cart bridge is not connected");
}
