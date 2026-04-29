"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/context/cart-context";
import { trackEvent } from "@/lib/analytics";
import { formatRub } from "@/lib/format";
import { applyRussianNbsp } from "@/lib/ru-typography";
import {
  hasCheckoutOrderErrors,
  type CheckoutCustomer,
  type CheckoutOrderErrors,
  validateCreateOrderPayload,
} from "@/lib/checkout-order";

const initialCustomer: CheckoutCustomer = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  city: "",
  address1: "",
  postcode: "",
  comment: "",
};

export function CheckoutForm() {
  const { lines } = useCart();
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [errors, setErrors] = useState<CheckoutOrderErrors>({});
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<string[]>([]);

  const total = useMemo(
    () => lines.reduce((sum, line) => sum + Number.parseFloat(line.price) * line.quantity, 0),
    [lines],
  );

  const update = <K extends keyof CheckoutCustomer>(field: K, value: CheckoutCustomer[K]) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    if (state !== "idle") {
      setState("idle");
      setMessage("");
    }
    setErrors((prev) => ({ ...prev, [field]: undefined, lines: undefined }));
  };

  useEffect(() => {
    const q = customer.address1.trim();
    if (q.length < 3) {
      return;
    }
    const timer = window.setTimeout(async () => {
      const res = await fetch(`/api/address/suggest?q=${encodeURIComponent(q)}`);
      const data = (await res.json()) as { suggestions?: string[] };
      setAddressSuggestions(data.suggestions ?? []);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [customer.address1]);

  const submit = async () => {
    const payload = { customer, lines };
    const validationErrors = validateCreateOrderPayload(payload);
    if (hasCheckoutOrderErrors(validationErrors)) {
      setErrors(validationErrors);
      setState("error");
      setMessage(applyRussianNbsp("Исправьте ошибки и повторите попытку."));
      return;
    }

    setState("loading");
    setMessage("");
    setPaymentUrl(null);
    trackEvent("begin_checkout", {
      items: lines.map((line) => ({
        item_id: line.productId,
        item_name: line.name,
        price: Number(line.price),
        quantity: line.quantity,
      })),
      value: total,
      currency: "RUB",
    });

    try {
      const response = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as {
        ok: boolean;
        message?: string;
        errors?: CheckoutOrderErrors;
        paymentUrl?: string | null;
        orderId?: number;
      };

      if (!response.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setState("error");
        setMessage(
          data.message
            ? applyRussianNbsp(data.message)
            : applyRussianNbsp("Не удалось оформить заказ."),
        );
        return;
      }

      setState("success");
      setMessage(applyRussianNbsp(`Заказ № ${data.orderId ?? ""} создан.`));
      setPaymentUrl(data.paymentUrl ?? null);
      trackEvent("purchase", {
        transaction_id: data.orderId,
        value: total,
        currency: "RUB",
      });
    } catch {
      setState("error");
      setMessage(applyRussianNbsp("Ошибка сети. Повторите попытку."));
    }
  };

  if (lines.length === 0) {
    return (
      <div className="rounded-[8px] border border-brand-border bg-white p-8 shadow-card">
        <p className="text-brand-muted">
          {applyRussianNbsp("Корзина пуста. Добавьте товары, чтобы оформить заказ.")}
        </p>
        <Link
          href="/catalog"
          className="mt-4 inline-flex text-brand-accent hover:text-brand-primary"
        >
          {applyRussianNbsp("Перейти в каталог")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr]">
      <form
        className="rounded-[8px] border border-brand-border bg-white p-5 shadow-card sm:p-8"
        onSubmit={async (e) => {
          e.preventDefault();
          await submit();
        }}
        noValidate
      >
        <h2 className="font-heading text-2xl font-semibold text-brand-primary">
          Данные для заказа
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <Input
            label="Имя"
            value={customer.firstName}
            onChange={(v) => update("firstName", v)}
            error={errors.firstName}
          />
          <Input
            label="Фамилия"
            value={customer.lastName}
            onChange={(v) => update("lastName", v)}
            error={errors.lastName}
          />
          <Input
            label="Телефон"
            value={customer.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
          />
          <Input
            label="Email"
            type="email"
            value={customer.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
          />
          <Input
            label="Город"
            value={customer.city}
            onChange={(v) => update("city", v)}
            error={errors.city}
          />
          <Input
            label="Индекс"
            value={customer.postcode}
            onChange={(v) => update("postcode", v)}
            error={errors.postcode}
          />
        </div>
        <div className="mt-4">
          <Input
            label="Адрес доставки"
            value={customer.address1}
            onChange={(v) => {
              update("address1", v);
              if (v.trim().length < 3) setAddressSuggestions([]);
            }}
            error={errors.address1}
          />
          {addressSuggestions.length > 0 ? (
            <div className="mt-2 rounded-[6px] border border-brand-border bg-white p-2">
              {addressSuggestions.map((suggestion) => (
                <button
                  type="button"
                  key={suggestion}
                  onClick={() => {
                    update("address1", suggestion);
                    setAddressSuggestions([]);
                  }}
                  className="block w-full rounded-[6px] px-2 py-1 text-left text-sm hover:bg-brand-surface"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-brand-text">
            {applyRussianNbsp("Комментарий к заказу")}
          </label>
          <textarea
            rows={4}
            value={customer.comment}
            onChange={(e) => update("comment", e.target.value)}
            className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
          />
        </div>

        {errors.lines ? <p className="mt-3 text-sm text-[#cb2d2d]">{errors.lines}</p> : null}
        {message ? (
          <p
            className={`mt-4 text-sm ${state === "success" ? "text-[#12703a]" : "text-[#cb2d2d]"}`}
          >
            {message}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={state === "loading"}
            className="inline-flex items-center justify-center rounded-[6px] bg-brand-accent px-8 py-3 text-base font-semibold text-white shadow-card transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {state === "loading" ? "Создание заказа…" : "Создать заказ"}
          </button>
          {paymentUrl ? (
            <a
              href={paymentUrl}
              className="inline-flex items-center justify-center rounded-[6px] border border-brand-border bg-white px-8 py-3 text-base font-semibold text-brand-primary hover:border-brand-muted"
            >
              {applyRussianNbsp("Перейти к оплате")}
            </a>
          ) : null}
        </div>
      </form>

      <aside className="rounded-[8px] border border-brand-border bg-brand-surface p-5 shadow-card sm:p-8">
        <h3 className="font-heading text-xl font-semibold text-brand-primary">Ваш заказ</h3>
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={line.productId} className="flex items-start justify-between gap-3 text-sm">
              <span className="text-brand-text">
                {line.name} × {line.quantity}
              </span>
              <span className="font-medium text-brand-primary">
                {formatRub(Number.parseFloat(line.price) * line.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-brand-border pt-4 text-lg font-semibold text-brand-text">
          Итого: {formatRub(total)}
        </p>
      </aside>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: "text" | "email";
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-brand-text">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-[6px] border border-brand-border px-4 py-3 text-brand-text outline-none ring-brand-accent focus:ring-2"
      />
      {error ? <p className="mt-1 text-sm text-[#cb2d2d]">{error}</p> : null}
    </div>
  );
}
