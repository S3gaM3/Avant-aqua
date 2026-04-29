import { NextResponse } from "next/server";
import { getWooCommerceCredentials, getWordPressUrl } from "@/lib/env";
import { applyRussianNbsp } from "@/lib/ru-typography";

type CouponApiItem = {
  code: string;
  discount_type: "percent" | "fixed_cart" | "fixed_product";
  amount: string;
  minimum_amount?: string;
  maximum_amount?: string;
};

function couponUrl(code: string): string | null {
  const base = getWordPressUrl();
  const creds = getWooCommerceCredentials();
  if (!base || !creds) return null;
  const params = new URLSearchParams({
    search: code,
    consumer_key: creds.key,
    consumer_secret: creds.secret,
  });
  return `${base}/wp-json/wc/v3/coupons?${params.toString()}`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as {
    code?: string;
    subtotal?: number;
  } | null;
  const code = body?.code?.trim().toUpperCase() ?? "";
  const subtotal = Number(body?.subtotal ?? 0);
  if (!code) {
    return NextResponse.json(
      { ok: false, message: applyRussianNbsp("Введите промокод") },
      { status: 400 },
    );
  }

  const url = couponUrl(code);
  if (!url) {
    return NextResponse.json(
      { ok: false, message: applyRussianNbsp("Купоны недоступны: Woo API не настроен.") },
      { status: 400 },
    );
  }

  const res = await fetch(url, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json(
      { ok: false, message: applyRussianNbsp("Не удалось проверить промокод") },
      { status: 502 },
    );
  }
  const list = (await res.json()) as CouponApiItem[];
  const coupon = list.find((item) => item.code.toUpperCase() === code);
  if (!coupon) {
    return NextResponse.json(
      { ok: false, message: applyRussianNbsp("Промокод не найден") },
      { status: 404 },
    );
  }

  const minAmount = Number(coupon.minimum_amount || 0);
  if (minAmount > 0 && subtotal < minAmount) {
    return NextResponse.json({
      ok: false,
      message: applyRussianNbsp(
        `Минимальная сумма для промокода: ${minAmount.toLocaleString("ru-RU")} ₽`,
      ),
    });
  }

  let discountAmount = 0;
  if (coupon.discount_type === "percent") {
    discountAmount = Number(((subtotal * Number(coupon.amount)) / 100).toFixed(2));
  } else {
    discountAmount = Number(coupon.amount);
  }
  discountAmount = Math.max(0, Math.min(discountAmount, subtotal));

  return NextResponse.json({
    ok: true,
    code,
    discountAmount,
    discountType: coupon.discount_type,
    message: applyRussianNbsp("Промокод применён"),
  });
}
