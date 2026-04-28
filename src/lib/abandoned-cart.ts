type CartItemLite = {
  productId: number;
  quantity: number;
  price: number;
};

const ABANDONED_CART_COOLDOWN_MS = 30 * 60 * 1000;

function normalizeItems(items: CartItemLite[]): string {
  return items
    .map((item) => `${item.productId}:${item.quantity}:${item.price}`)
    .sort()
    .join("|");
}

export function createAbandonedCartFingerprint(input: {
  email: string;
  total: number;
  items: CartItemLite[];
}): string {
  return `${input.email.trim().toLowerCase()}::${input.total.toFixed(2)}::${normalizeItems(input.items)}`;
}

export function shouldSendAbandonedCartNow(
  fingerprint: string,
  now = Date.now(),
): { ok: boolean; retryAfterMs: number } {
  if (typeof window === "undefined") {
    return { ok: true, retryAfterMs: 0 };
  }
  const key = `abandoned-cart-sent:${fingerprint}`;
  const lastRaw = localStorage.getItem(key);
  const lastTs = lastRaw ? Number(lastRaw) : 0;
  if (lastTs > 0) {
    const diff = now - lastTs;
    if (diff < ABANDONED_CART_COOLDOWN_MS) {
      return { ok: false, retryAfterMs: ABANDONED_CART_COOLDOWN_MS - diff };
    }
  }
  return { ok: true, retryAfterMs: 0 };
}

export function markAbandonedCartSent(fingerprint: string, now = Date.now()): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(`abandoned-cart-sent:${fingerprint}`, String(now));
}
