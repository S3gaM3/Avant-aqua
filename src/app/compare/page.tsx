"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { formatRub } from "@/lib/format";
import { applyRussianNbsp } from "@/lib/ru-typography";

const ATTR_NAME_MAP: Record<string, string> = {
  performance: "Производительность",
  capacity: "Производительность",
  flow: "Производительность",
  power: "Мощность",
  voltage: "Напряжение",
  material: "Материал",
  cartridge: "Тип картриджа",
  cartridge_type: "Тип картриджа",
};

function normalizeAttrName(raw: string): string {
  const key = raw.trim().toLowerCase().replace(/\s+/g, "_");
  return ATTR_NAME_MAP[key] ?? raw.trim();
}

function getMostFrequentValue(values: string[]): string | null {
  if (values.length === 0) return null;
  const map = new Map<string, number>();
  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }
  let winner: string | null = null;
  let max = -1;
  for (const [value, count] of map) {
    if (count > max) {
      winner = value;
      max = count;
    }
  }
  return winner;
}

export default function ComparePage() {
  const compare = usePreferencesStore((s) => s.compare);
  const [onlyDiff, setOnlyDiff] = useState(false);
  const normalizedRows = useMemo(
    () =>
      Array.from(
        new Set(
          compare
            .flatMap((p) => (p.attributes ?? []).map((a) => normalizeAttrName(a.name)))
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b, "ru")),
    [compare],
  );

  const baseRows = useMemo(
    () => [
      {
        name: "Цена",
        values: compare.map((p) => formatRub(p.price)),
      },
      {
        name: "Артикул",
        values: compare.map((p) => p.sku || "—"),
      },
      {
        name: "Наличие",
        values: compare.map((p) => (p.stock_status === "instock" ? "В наличии" : "Под заказ")),
      },
    ],
    [compare],
  );

  const attributeRows = useMemo(
    () =>
      normalizedRows.map((attributeName) => ({
        name: attributeName,
        values: compare.map((p) => {
          const attr = (p.attributes ?? []).find(
            (a) => normalizeAttrName(a.name) === attributeName,
          );
          return attr?.options?.length ? attr.options.join(", ") : "—";
        }),
      })),
    [compare, normalizedRows],
  );

  const allRows = useMemo(() => [...baseRows, ...attributeRows], [baseRows, attributeRows]);
  const rowStats = useMemo(
    () =>
      allRows.map((row) => {
        const baseline = getMostFrequentValue(row.values);
        const hasDiff = new Set(row.values).size > 1;
        return { name: row.name, baseline, hasDiff };
      }),
    [allRows],
  );
  const rowStatsMap = useMemo(() => new Map(rowStats.map((item) => [item.name, item])), [rowStats]);
  const rowsToShow = useMemo(
    () => (onlyDiff ? allRows.filter((row) => rowStatsMap.get(row.name)?.hasDiff) : allRows),
    [allRows, onlyDiff, rowStatsMap],
  );

  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Сравнение товаров" current="Сравнение" />
      {compare.length === 0 ? (
        <p className="mt-6 text-brand-muted">
          {applyRussianNbsp("Нет товаров для сравнения. Перейдите в")}{" "}
          <Link href="/catalog" className="text-brand-accent">
            каталог
          </Link>
          .
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-[8px] border border-brand-border bg-white shadow-card">
          <div className="border-b border-brand-border p-3">
            <label className="inline-flex items-center gap-2 text-sm text-brand-text">
              <input
                type="checkbox"
                checked={onlyDiff}
                onChange={(e) => setOnlyDiff(e.target.checked)}
              />
              {applyRussianNbsp("Показать только различия")}
            </label>
          </div>
          <table className="min-w-full text-left text-sm">
            <thead className="bg-brand-surface text-brand-primary">
              <tr>
                <th className="sticky left-0 top-0 z-20 bg-brand-surface px-4 py-3">Параметр</th>
                {compare.map((p, idx) => (
                  <th
                    key={`${p.id}-${p.slug}-${idx}`}
                    className="sticky top-0 z-10 bg-brand-surface px-4 py-3"
                  >
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowsToShow.map((row) => (
                <tr className="border-t border-brand-border" key={row.name}>
                  <td className="sticky left-0 bg-white px-4 py-3 font-medium">{row.name}</td>
                  {row.values.map((value, idx) => {
                    const stats = rowStatsMap.get(row.name);
                    const isDifferent =
                      Boolean(stats?.hasDiff) &&
                      stats?.baseline !== null &&
                      stats?.baseline !== undefined &&
                      value !== stats.baseline;
                    return (
                      <td
                        key={`${row.name}-${idx}`}
                        className={`px-4 py-3 ${isDifferent ? "bg-[#ffe8db] font-medium text-brand-primary" : ""}`}
                      >
                        {value}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Section>
  );
}
