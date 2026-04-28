"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useCartStore, type CartLine } from "@/lib/stores/cart-store";

type CartSnapshot = {
  lines: CartLine[];
  couponCode: string | null;
  discountAmount: number;
};

const GUEST_SNAPSHOT_KEY = "avant-aqua-cart-guest-snapshot-v1";
const USER_CART_PREFIX = "avant-aqua-cart-user-v1:";

function mergeLines(primary: CartLine[], secondary: CartLine[]): CartLine[] {
  const map = new Map<number, CartLine>();
  for (const line of [...primary, ...secondary]) {
    const existing = map.get(line.productId);
    if (!existing) {
      map.set(line.productId, { ...line, quantity: Math.max(1, line.quantity) });
      continue;
    }
    map.set(line.productId, {
      ...line,
      quantity: existing.quantity + Math.max(1, line.quantity),
    });
  }
  return Array.from(map.values());
}

function readSnapshot(key: string): CartSnapshot | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CartSnapshot>;
    return {
      lines: Array.isArray(parsed.lines) ? parsed.lines : [],
      couponCode: parsed.couponCode ?? null,
      discountAmount: Number(parsed.discountAmount ?? 0),
    };
  } catch {
    return null;
  }
}

function writeSnapshot(key: string, value: CartSnapshot) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function CartSessionSync() {
  const { status, data } = useSession();
  const lines = useCartStore((s) => s.lines);
  const couponCode = useCartStore((s) => s.couponCode);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const setCartState = useCartStore((s) => s.setCartState);
  const lastUserIdRef = useRef<string | null>(null);
  const syncedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (status === "loading") return;

    const userId = data?.user?.id ?? null;
    const current: CartSnapshot = { lines, couponCode, discountAmount };

    if (status === "authenticated" && userId) {
      if (syncedUserIdRef.current === userId) return;
      const guestSnapshot = readSnapshot(GUEST_SNAPSHOT_KEY);
      if (!guestSnapshot) {
        writeSnapshot(GUEST_SNAPSHOT_KEY, current);
      }

      const userKey = `${USER_CART_PREFIX}${userId}`;
      const userSnapshot = readSnapshot(userKey) ?? {
        lines: [],
        couponCode: null,
        discountAmount: 0,
      };

      const merged = mergeLines(userSnapshot.lines, current.lines);
      const next: CartSnapshot = {
        lines: merged,
        couponCode: null,
        discountAmount: 0,
      };
      setCartState(next);
      writeSnapshot(userKey, next);
      lastUserIdRef.current = userId;
      syncedUserIdRef.current = userId;
      return;
    }

    if (status === "unauthenticated" && lastUserIdRef.current) {
      const userKey = `${USER_CART_PREFIX}${lastUserIdRef.current}`;
      writeSnapshot(userKey, current);

      const guest = readSnapshot(GUEST_SNAPSHOT_KEY);
      if (guest) {
        setCartState({
          lines: guest.lines,
          couponCode: guest.couponCode,
          discountAmount: guest.discountAmount,
        });
      }
      lastUserIdRef.current = null;
      syncedUserIdRef.current = null;
    }
  }, [status, data?.user?.id, lines, couponCode, discountAmount, setCartState]);

  return null;
}
