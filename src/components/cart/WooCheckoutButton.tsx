"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";

export function WooCheckoutButton() {
  const router = useRouter();
  const { lines } = useCart();

  const onCheckout = () => {
    if (lines.length === 0) return;
    router.push("/checkout");
  };

  return (
    <div className="flex w-full flex-col items-end gap-2">
      <button
        type="button"
        onClick={onCheckout}
        disabled={lines.length === 0}
        className="inline-flex rounded-[6px] bg-brand-accent px-10 py-4 text-base font-semibold text-white shadow-card transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Оформить заказ
      </button>
    </div>
  );
}
