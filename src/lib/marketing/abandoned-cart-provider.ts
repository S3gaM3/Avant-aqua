type AbandonedCartEvent = {
  email: string;
  total: number;
  currency: string;
  items: Array<{
    productId: number;
    name: string;
    quantity: number;
    price: number;
  }>;
  capturedAt: string;
};

export function buildAbandonedCartPayload(
  provider: "generic" | "unisender",
  event: AbandonedCartEvent,
): Record<string, unknown> {
  if (provider === "unisender") {
    return {
      eventName: "abandoned_cart_captured",
      contact: {
        email: event.email,
      },
      data: {
        total: event.total,
        currency: event.currency,
        items: event.items,
        capturedAt: event.capturedAt,
      },
    };
  }

  return {
    event: "abandoned_cart_captured",
    email: event.email,
    total: event.total,
    currency: event.currency,
    items: event.items,
    capturedAt: event.capturedAt,
  };
}
