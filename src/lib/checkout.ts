import type { CartLine } from "@/lib/stores/cart-store";

export type CheckoutBridgePayload = {
  lines: CartLine[];
};

export type CheckoutBridgeErrors = {
  lines?: string;
};

export function validateCheckoutBridgePayload(
  payload: CheckoutBridgePayload,
): CheckoutBridgeErrors {
  if (!Array.isArray(payload.lines) || payload.lines.length === 0) {
    return { lines: "Корзина пуста" };
  }

  const hasInvalidLine = payload.lines.some((line) => {
    const price = Number.parseFloat(line.price);
    return (
      !line.productId ||
      line.quantity < 1 ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !line.name ||
      !line.slug
    );
  });

  if (hasInvalidLine) {
    return { lines: "Некорректные данные корзины" };
  }

  return {};
}

export function hasCheckoutBridgeErrors(errors: CheckoutBridgeErrors): boolean {
  return Object.keys(errors).length > 0;
}
