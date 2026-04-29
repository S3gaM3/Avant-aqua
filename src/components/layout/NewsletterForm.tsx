"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { applyRussianNbsp } from "@/lib/ru-typography";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="mt-3"
      onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          const res = await fetch("/api/marketing/subscribe", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          const data = (await res.json()) as { ok?: boolean; message?: string };
          if (!res.ok || !data.ok) {
            toast.error(
              data.message
                ? applyRussianNbsp(data.message)
                : applyRussianNbsp("Не удалось оформить подписку"),
            );
            return;
          }
          toast.success(
            data.message ? applyRussianNbsp(data.message) : applyRussianNbsp("Подписка оформлена"),
          );
          setEmail("");
        } catch {
          toast.error(applyRussianNbsp("Сервис подписки временно недоступен"));
        } finally {
          setLoading(false);
        }
      }}
    >
      <label className="block text-xs text-white/80">
        {applyRussianNbsp("Подписка на новости и акции")}
      </label>
      <div className="mt-2 flex gap-2">
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full border-white/30 bg-white text-brand-text placeholder:text-brand-muted"
        />
        <Button type="submit" disabled={loading} size="sm" className="min-w-[62px]">
          {loading ? "…" : "OK"}
        </Button>
      </div>
    </form>
  );
}
