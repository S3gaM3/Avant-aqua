"use client";

import { toast } from "sonner";
import { useCartStore } from "@/lib/stores/cart-store";
import type { AccountOrderItem } from "@/lib/types/account";
import type { Product } from "@/lib/types/commerce";

function toProduct(item: AccountOrderItem): Product {
  return {
    id: item.productId,
    name: item.name,
    slug: item.slug,
    sku: "",
    price: item.unitPrice,
    short_description: "",
    description: "",
    permalink: `/catalog/product/${item.slug}`,
    images: [],
    categories: [],
    stock_status: "instock",
  };
}

export function ReorderButton({ items }: { items: AccountOrderItem[] }) {
  const addItem = useCartStore((s) => s.addItem);

  return (
    <button
      type="button"
      className="rounded-[6px] border border-brand-border px-3 py-2 text-xs font-medium text-brand-primary hover:border-brand-primary"
      onClick={() => {
        if (items.length === 0) {
          toast.error("В заказе нет доступных товаров для повтора");
          return;
        }
        for (const item of items) {
          addItem(toProduct(item), item.quantity);
        }
        toast.success("Товары из заказа добавлены в корзину");
      }}
    >
      Повторить заказ
    </button>
  );
}
