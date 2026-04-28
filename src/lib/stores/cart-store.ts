"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/types/commerce";

export type CartLine = {
  productId: number;
  quantity: number;
  name: string;
  price: string;
  slug: string;
};

type CartStoreState = {
  lines: CartLine[];
  couponCode: string | null;
  discountAmount: number;
  setCartState: (payload: {
    lines: CartLine[];
    couponCode?: string | null;
    discountAmount?: number;
  }) => void;
  addItem: (product: Product, qty?: number) => void;
  updateQty: (productId: number, qty: number) => void;
  removeItem: (productId: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => Promise<{ ok: boolean; message: string }>;
  removeCoupon: () => void;
};

export const useCartStore = create<CartStoreState>()(
  persist(
    (set, get) => ({
      lines: [],
      couponCode: null,
      discountAmount: 0,
      setCartState: ({ lines, couponCode = null, discountAmount = 0 }) =>
        set({
          lines,
          couponCode,
          discountAmount,
        }),
      addItem: (product, qty = 1) =>
        set((state) => {
          const existing = state.lines.find((l) => l.productId === product.id);
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l.productId === product.id ? { ...l, quantity: l.quantity + qty } : l,
              ),
            };
          }
          return {
            lines: [
              ...state.lines,
              {
                productId: product.id,
                quantity: qty,
                name: product.name,
                price: product.price,
                slug: product.slug,
              },
            ],
          };
        }),
      updateQty: (productId, qty) =>
        set((state) => {
          if (qty < 1) {
            return { lines: state.lines.filter((l) => l.productId !== productId) };
          }
          return {
            lines: state.lines.map((l) =>
              l.productId === productId ? { ...l, quantity: qty } : l,
            ),
          };
        }),
      removeItem: (productId) =>
        set((state) => ({ lines: state.lines.filter((l) => l.productId !== productId) })),
      clear: () => set({ lines: [], couponCode: null, discountAmount: 0 }),
      applyCoupon: async (code) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) return { ok: false, message: "Введите промокод" };

        const subtotal = get().lines.reduce(
          (sum, line) => sum + Number.parseFloat(line.price) * line.quantity,
          0,
        );

        try {
          const response = await fetch("/api/checkout/coupon", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code: normalized, subtotal }),
          });
          const data = (await response.json()) as {
            ok?: boolean;
            message?: string;
            discountAmount?: number;
            code?: string;
          };
          if (response.ok && data.ok) {
            set({
              couponCode: data.code ?? normalized,
              discountAmount: Number(data.discountAmount ?? 0),
            });
            return { ok: true, message: data.message ?? "Промокод применен" };
          }
          // If server coupon check failed, fall back to local demo codes.
        } catch {
          // ignore and fallback
        }

        if (normalized === "AVANT10") {
          set({
            couponCode: normalized,
            discountAmount: Number((subtotal * 0.1).toFixed(2)),
          });
          return { ok: true, message: "Промокод применен: -10%" };
        }

        if (normalized === "AQUA500" && subtotal >= 5000) {
          set({
            couponCode: normalized,
            discountAmount: 500,
          });
          return { ok: true, message: "Промокод применен: -500 ₽" };
        }

        set({ couponCode: null, discountAmount: 0 });
        return { ok: false, message: "Промокод не найден или не подходит" };
      },
      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),
    }),
    {
      name: "avant-aqua-cart-v2",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        lines: state.lines,
        couponCode: state.couponCode,
        discountAmount: state.discountAmount,
      }),
    },
  ),
);
