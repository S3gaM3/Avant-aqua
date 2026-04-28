"use client";

import { createContext, useContext, useMemo } from "react";
import type { Product } from "@/lib/types/commerce";
import { useCartStore, type CartLine } from "@/lib/stores/cart-store";

type CartContextValue = {
  lines: CartLine[];
  itemCount: number;
  addItem: (product: Product, qty?: number) => void;
  updateQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  couponCode: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useCartStore((s) => s.lines);
  const addItem = useCartStore((s) => s.addItem);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);
  const couponCode = useCartStore((s) => s.couponCode);
  const discountAmount = useCartStore((s) => s.discountAmount);
  const applyCoupon = useCartStore((s) => s.applyCoupon);
  const removeCoupon = useCartStore((s) => s.removeCoupon);

  const itemCount = useMemo(() => lines.reduce((acc, l) => acc + l.quantity, 0), [lines]);

  const value = useMemo(
    () => ({
      lines,
      itemCount,
      addItem,
      updateQty,
      removeItem,
      clear,
      couponCode,
      discountAmount,
      applyCoupon,
      removeCoupon,
    }),
    [
      lines,
      itemCount,
      addItem,
      updateQty,
      removeItem,
      clear,
      couponCode,
      discountAmount,
      applyCoupon,
      removeCoupon,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
