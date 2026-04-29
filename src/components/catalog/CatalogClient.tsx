"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import { trackEvent } from "@/lib/analytics";
import { applyRussianNbsp } from "@/lib/ru-typography";
import type { Product, ProductCategory } from "@/lib/types/commerce";

type SortKey = "popular" | "priceAsc" | "priceDesc" | "name";

function getNumericPrice(price: string): number {
  const num = Number.parseFloat(price);
  return Number.isFinite(num) ? num : 0;
}

export function CatalogClient({
  products,
  categories,
}: {
  products: Product[];
  categories: ProductCategory[];
}) {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sort, setSort] = useState<SortKey>("popular");
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const listTrackedRef = useRef(false);
  const searchTrackTimeoutRef = useRef<number | null>(null);

  const priceCap = useMemo(
    () => Math.max(...products.map((p) => getNumericPrice(p.price)), 0),
    [products],
  );

  const effectiveMaxPrice = maxPrice === 0 ? priceCap : maxPrice;
  const boundedMinPrice = Math.max(0, Math.min(minPrice, effectiveMaxPrice));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byBase = products.filter((p) => {
      const inCategory =
        selectedCategory === "all" || p.categories.some((c) => c.slug === selectedCategory);
      const inQuery =
        !q || p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q);
      const price = getNumericPrice(p.price);
      const inPrice = price >= boundedMinPrice && price <= effectiveMaxPrice;
      return inCategory && inQuery && inPrice;
    });

    return [...byBase].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "ru");
      if (sort === "priceAsc") return getNumericPrice(a.price) - getNumericPrice(b.price);
      if (sort === "priceDesc") return getNumericPrice(b.price) - getNumericPrice(a.price);
      return 0;
    });
  }, [products, query, selectedCategory, sort, boundedMinPrice, effectiveMaxPrice]);

  useEffect(() => {
    if (!listTrackedRef.current && filtered.length > 0) {
      trackEvent("view_item_list", {
        item_list_name: "catalog",
        items: filtered.slice(0, 12).map((p, idx) => ({
          item_id: p.id,
          item_name: p.name,
          index: idx + 1,
          price: Number.parseFloat(p.price || "0"),
        })),
      });
      listTrackedRef.current = true;
    }
  }, [filtered]);

  useEffect(() => {
    return () => {
      if (searchTrackTimeoutRef.current !== null) {
        window.clearTimeout(searchTrackTimeoutRef.current);
      }
    };
  }, []);

  return (
    <section className="mt-16">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr] xl:grid-cols-[300px_1fr]">
        <aside className="rounded-[8px] border border-brand-border bg-white p-5 shadow-card">
          <h2 className="font-heading text-2xl font-bold text-brand-primary">Фильтры</h2>
          <div className="mt-4 space-y-3">
            <input
              value={query}
              onChange={(e) => {
                const value = e.target.value;
                setQuery(value);
                const term = value.trim();
                if (searchTrackTimeoutRef.current !== null) {
                  window.clearTimeout(searchTrackTimeoutRef.current);
                }
                if (term.length >= 2) {
                  searchTrackTimeoutRef.current = window.setTimeout(() => {
                    trackEvent("search", {
                      search_term: term,
                    });
                    searchTrackTimeoutRef.current = null;
                  }, 250);
                }
              }}
              placeholder="Поиск по каталогу..."
              className="w-full rounded-[6px] border border-brand-border px-3 py-2"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-[6px] border border-brand-border px-3 py-2"
            >
              <option value="all">Все категории</option>
              {categories.map((c) => (
                <option value={c.slug} key={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="w-full rounded-[6px] border border-brand-border px-3 py-2"
            >
              <option value="popular">{applyRussianNbsp("По популярности")}</option>
              <option value="priceAsc">Сначала дешевые</option>
              <option value="priceDesc">Сначала дорогие</option>
              <option value="name">{applyRussianNbsp("По названию")}</option>
            </select>
            <div className="rounded-[6px] border border-brand-border bg-brand-surface p-3 text-sm">
              <p>
                {applyRussianNbsp("Цена: от")} {Math.round(boundedMinPrice)} ₽{" "}
                {applyRussianNbsp("до")} {Math.round(effectiveMaxPrice)} ₽
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  max={Math.max(priceCap, 1)}
                  value={Math.round(boundedMinPrice)}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (Number.isNaN(next)) return;
                    setMinPrice(Math.max(0, Math.min(next, effectiveMaxPrice)));
                  }}
                  className="w-full rounded-[6px] border border-brand-border px-2 py-2"
                  placeholder="от"
                />
                <input
                  type="number"
                  min={0}
                  max={Math.max(priceCap, 1)}
                  value={Math.round(effectiveMaxPrice)}
                  onChange={(e) => {
                    const next = Number(e.target.value);
                    if (Number.isNaN(next)) return;
                    const bounded = Math.max(0, Math.min(next, priceCap));
                    setMaxPrice(bounded);
                    if (bounded < boundedMinPrice) setMinPrice(bounded);
                  }}
                  className="w-full rounded-[6px] border border-brand-border px-2 py-2"
                  placeholder="до"
                />
              </div>
            </div>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-[8px] border border-brand-border bg-white px-4 py-3 text-sm">
            <span className="text-brand-muted">
              {applyRussianNbsp("Найдено товаров:")} {filtered.length}
            </span>
            <span className="text-brand-muted">Каталог AVANT AQUA</span>
          </div>
          <div className="grid auto-rows-fr grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-8">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          {filtered.length === 0 ? (
            <p className="mt-6 text-sm text-brand-muted">
              {applyRussianNbsp("По фильтрам товары не найдены.")}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
