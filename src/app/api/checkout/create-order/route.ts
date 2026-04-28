import {
  hasCheckoutOrderErrors,
  type CreateOrderPayload,
  validateCreateOrderPayload,
} from "@/lib/checkout-order";
import { getWooCommerceCredentials, getWordPressUrl } from "@/lib/env";
import { createWooOrder } from "@/lib/woocommerce";
import { jsonError, jsonOk, parseJsonBody } from "@/lib/api-response";

export async function POST(request: Request) {
  const payload = await parseJsonBody<CreateOrderPayload>(request);
  if (!payload) {
    return jsonError("Некорректный формат запроса", 400);
  }

  const errors = validateCreateOrderPayload(payload);
  if (hasCheckoutOrderErrors(errors)) {
    return jsonError("Проверьте корректность данных", 400, { errors });
  }

  if (!getWordPressUrl() || !getWooCommerceCredentials()) {
    return jsonError(
      "Checkout временно недоступен: не настроены WooCommerce API credentials.",
      503,
    );
  }

  try {
    const order = await createWooOrder(payload);
    return jsonOk({ ok: true, ...order });
  } catch (error) {
    console.error("[api/checkout/create-order] failed", error);
    return jsonError("Не удалось создать заказ в WooCommerce. Проверьте настройки API.", 500);
  }
}
