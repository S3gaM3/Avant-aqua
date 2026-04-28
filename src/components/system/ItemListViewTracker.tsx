"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";
import type { Product } from "@/lib/types/commerce";

export function ItemListViewTracker({
  listName,
  products,
}: {
  listName: string;
  products: Product[];
}) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current || products.length === 0) return;
    trackEvent("view_item_list", {
      item_list_name: listName,
      items: products.slice(0, 12).map((p, index) => ({
        item_id: p.id,
        item_name: p.name,
        index: index + 1,
        price: Number.parseFloat(p.price || "0"),
      })),
    });
    sent.current = true;
  }, [listName, products]);

  return null;
}
