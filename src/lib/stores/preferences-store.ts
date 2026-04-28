"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Product } from "@/lib/types/commerce";

type PreferencesStore = {
  wishlist: Product[];
  compare: Product[];
  toggleWishlist: (product: Product) => void;
  toggleCompare: (product: Product) => void;
};

function toggle(list: Product[], product: Product): Product[] {
  if (list.some((item) => item.id === product.id)) {
    return list.filter((item) => item.id !== product.id);
  }
  return [...list, product];
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      wishlist: [],
      compare: [],
      toggleWishlist: (product) => set((state) => ({ wishlist: toggle(state.wishlist, product) })),
      toggleCompare: (product) =>
        set((state) => ({ compare: toggle(state.compare, product).slice(0, 4) })),
    }),
    {
      name: "avant-aqua-preferences-v1",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
