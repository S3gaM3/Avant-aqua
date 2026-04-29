"use client";

import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { WooCheckoutButton } from "@/components/cart/WooCheckoutButton";
import { useCart } from "@/context/cart-context";
import { trackEvent } from "@/lib/analytics";
import {
  createAbandonedCartFingerprint,
  markAbandonedCartSent,
  shouldSendAbandonedCartNow,
} from "@/lib/abandoned-cart";
import { formatRub } from "@/lib/format";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { applyRussianNbsp } from "@/lib/ru-typography";

export default function CartPage() {
  const { lines, updateQty, removeItem, couponCode, discountAmount, applyCoupon, removeCoupon } =
    useCart();
  const [couponInput, setCouponInput] = useState("");
  const [abandonedEmail, setAbandonedEmail] = useState("");
  const [abandonedStatus, setAbandonedStatus] = useState<"" | "saved" | "error">("");
  const [touchStartX, setTouchStartX] = useState<Record<number, number>>({});

  const subtotal = lines.reduce((sum, l) => sum + parseFloat(l.price) * l.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount);

  useEffect(() => {
    if (lines.length === 0) return;
    trackEvent("view_cart", {
      value: total,
      currency: "RUB",
      items: lines.map((line) => ({
        item_id: line.productId,
        item_name: line.name,
        quantity: line.quantity,
        price: Number.parseFloat(line.price || "0"),
      })),
    });
  }, [lines, total]);

  useEffect(() => {
    if (!abandonedEmail.includes("@")) return;
    if (lines.length === 0) return;
    const t = window.setTimeout(async () => {
      const payload = {
        email: abandonedEmail.trim(),
        total,
        currency: "RUB",
        items: lines.map((line) => ({
          productId: line.productId,
          name: line.name,
          quantity: line.quantity,
          price: Number.parseFloat(line.price || "0"),
        })),
      };
      const fingerprint = createAbandonedCartFingerprint(payload);
      const policy = shouldSendAbandonedCartNow(fingerprint);
      if (!policy.ok) {
        setAbandonedStatus("saved");
        return;
      }
      try {
        const res = await fetch("/api/marketing/abandoned-cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          markAbandonedCartSent(fingerprint);
          setAbandonedStatus("saved");
          trackEvent("abandoned_cart_capture", {
            email_domain: abandonedEmail.split("@")[1] || "",
            value: total,
            currency: "RUB",
            items_count: lines.length,
          });
        } else {
          setAbandonedStatus("error");
        }
      } catch {
        setAbandonedStatus("error");
      }
    }, 700);
    return () => window.clearTimeout(t);
  }, [abandonedEmail, lines, total]);

  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Корзина" current="Корзина" />

      {lines.length === 0 ? (
        <p className="mt-10 text-lg text-brand-muted">
          Корзина пуста. Перейдите в{" "}
          <Link href="/catalog" className="font-medium text-brand-accent">
            каталог
          </Link>
          .
        </p>
      ) : (
        <>
          <ul className="mt-10 divide-y divide-brand-border rounded-[var(--radius-md)] border border-brand-border bg-white shadow-card">
            {lines.map((line) => (
              <li
                key={line.productId}
                className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
                onTouchStart={(e) =>
                  setTouchStartX((prev) => ({ ...prev, [line.productId]: e.touches[0].clientX }))
                }
                onTouchEnd={(e) => {
                  const start = touchStartX[line.productId];
                  if (!start) return;
                  if (start - e.changedTouches[0].clientX > 80) {
                    removeItem(line.productId);
                    toast.info(applyRussianNbsp("Товар удалён свайпом"));
                  }
                }}
              >
                <div>
                  <Link
                    href={`/catalog/product/${line.slug}`}
                    className="font-heading text-lg font-semibold text-brand-primary hover:text-brand-accent"
                  >
                    {line.name}
                  </Link>
                  <p className="mt-2 text-sm text-brand-muted">
                    {formatRub(line.price)} × {line.quantity}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    Количество
                    <Input
                      type="number"
                      min={1}
                      value={line.quantity}
                      onChange={(e) => updateQty(line.productId, Number(e.target.value) || 1)}
                      className="h-8 w-20 px-2 py-1"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      removeItem(line.productId);
                      toast.info(applyRussianNbsp("Товар удалён"));
                    }}
                    className="text-sm text-brand-accent hover:text-brand-primary"
                  >
                    Удалить
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-end gap-4 border-t border-brand-border pt-8">
            <Card className="w-full max-w-md p-4">
              <p className="text-sm font-medium text-brand-primary">
                Сохранить корзину и получить напоминание
              </p>
              <div className="mt-2 flex gap-2">
                <Input
                  type="email"
                  value={abandonedEmail}
                  onChange={(e) => {
                    setAbandonedEmail(e.target.value);
                    setAbandonedStatus("");
                  }}
                  placeholder="Ваш email"
                  className="flex-1"
                />
              </div>
              {abandonedStatus === "saved" ? (
                <p className="mt-2 text-xs text-[#12703a]">
                  {applyRussianNbsp("Контакт сохранён, напомним о корзине.")}
                </p>
              ) : null}
              {abandonedStatus === "error" ? (
                <p className="mt-2 text-xs text-[#b42318]">
                  Не удалось сохранить контакт. Проверьте email.
                </p>
              ) : null}
            </Card>
            <Card className="w-full max-w-md p-4">
              <p className="text-sm font-medium text-brand-primary">Промокод</p>
              <div className="mt-2 flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="AVANT10 или AQUA500"
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={async () => {
                    const result = await applyCoupon(couponInput);
                    if (result.ok) toast.success(result.message);
                    else toast.error(result.message);
                    if (result.ok) {
                      trackEvent("add_payment_info", {
                        coupon: couponInput.trim().toUpperCase(),
                        value: total,
                        currency: "RUB",
                      });
                    }
                  }}
                  className="rounded-[6px] bg-brand-accent px-3 py-2 text-sm font-medium text-white"
                >
                  Применить
                </button>
              </div>
              {couponCode ? (
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="mt-2 text-xs text-brand-muted underline"
                >
                  Удалить промокод {couponCode}
                </button>
              ) : null}
            </Card>
            <p className="text-sm text-brand-muted">Подытог: {formatRub(subtotal)}</p>
            {discountAmount > 0 ? (
              <p className="text-sm text-[#12703a]">Скидка: -{formatRub(discountAmount)}</p>
            ) : null}
            <p className="text-xl font-semibold text-brand-text">Итого: {formatRub(total)}</p>
            <WooCheckoutButton />
            <Link href="/checkout" className="text-sm text-brand-muted hover:text-brand-primary">
              Как работает оформление заказа
            </Link>
          </div>
        </>
      )}
    </Section>
  );
}
