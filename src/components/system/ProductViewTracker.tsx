"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function ProductViewTracker({
  id,
  name,
  price,
}: {
  id: number;
  name: string;
  price: number;
}) {
  useEffect(() => {
    trackEvent("view_item", {
      item_id: id,
      item_name: name,
      price,
      currency: "RUB",
    });
  }, [id, name, price]);

  return null;
}
