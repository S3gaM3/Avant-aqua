"use client";

import { useState } from "react";
import type { Product } from "@/lib/types/commerce";
import { useCart } from "@/context/cart-context";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

export function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [done, setDone] = useState(false);

  return (
    <button
      type="button"
      className="rounded-[6px] bg-brand-accent px-8 py-3 text-base font-semibold text-white shadow-card transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a] disabled:opacity-70"
      disabled={product.stock_status !== "instock"}
      onClick={() => {
        addItem(product, 1);
        trackEvent("add_to_cart", {
          item_id: product.id,
          item_name: product.name,
          price: Number(product.price || 0),
          quantity: 1,
        });
        setDone(true);
        toast.success("Товар добавлен в корзину");
        window.setTimeout(() => setDone(false), 2000);
      }}
    >
      {product.stock_status !== "instock"
        ? "Нет в наличии"
        : done
          ? "Добавлено в корзину"
          : "В корзину"}
    </button>
  );
}
