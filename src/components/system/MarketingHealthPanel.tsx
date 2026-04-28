"use client";

import { useEffect, useState } from "react";

type MarketingHealth = {
  ok: boolean;
  feature: string;
  configured: boolean;
  provider: "generic" | "unisender";
  hasToken: boolean;
};

export function MarketingHealthPanel() {
  const [data, setData] = useState<MarketingHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/marketing/abandoned-cart/health");
        if (!res.ok) throw new Error("health endpoint unavailable");
        const json = (await res.json()) as MarketingHealth;
        if (!cancelled) {
          setData(json);
          setError("");
        }
      } catch {
        if (!cancelled) setError("Не удалось получить статус маркетинговых интеграций.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-[8px] border border-brand-border bg-white p-5 text-sm text-brand-muted">
        Проверяем состояние webhook...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[8px] border border-[#b42318] bg-white p-5 text-sm text-[#b42318]">
        {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="rounded-[8px] border border-brand-border bg-white p-5 shadow-card">
      <h2 className="font-heading text-xl text-brand-primary">Abandoned Cart Webhook</h2>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-brand-muted">Feature</dt>
          <dd className="font-medium text-brand-text">{data.feature}</dd>
        </div>
        <div>
          <dt className="text-brand-muted">Configured</dt>
          <dd
            className={
              data.configured ? "font-medium text-[#12703a]" : "font-medium text-[#b42318]"
            }
          >
            {data.configured ? "Да" : "Нет"}
          </dd>
        </div>
        <div>
          <dt className="text-brand-muted">Provider</dt>
          <dd className="font-medium text-brand-text">{data.provider}</dd>
        </div>
        <div>
          <dt className="text-brand-muted">Token</dt>
          <dd
            className={
              data.hasToken ? "font-medium text-[#12703a]" : "font-medium text-brand-muted"
            }
          >
            {data.hasToken ? "Передается" : "Не задан"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
