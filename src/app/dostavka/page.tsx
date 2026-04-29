import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/sections/PageIntro";
import { applyRussianNbsp } from "@/lib/ru-typography";

export const metadata: Metadata = {
  title: "Доставка и оплата",
  description: "Условия доставки и оплаты.",
};

const methods = [
  ["Самовывоз", "Бесплатно"],
  ["Москва и МО", "от 1\u00a0000\u00a0₽"],
  ["Краснодар и край", "от 1\u00a0000\u00a0₽"],
  ["Крым", "50\u00a0₽/км"],
  ["Россия и СНГ", "по\u00a0тарифам ТК"],
];

export default function DeliveryPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro
        title="Доставка и оплата"
        current="Доставка и оплата"
        description={applyRussianNbsp(
          "Доставляем оборудование для бассейнов и SPA по Москве, регионам России и странам СНГ.",
        )}
      />

      <section className="mt-8 grid gap-4 lg:grid-cols-2">
        {methods.map(([title, price]) => (
          <Card key={title} className="p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-semibold text-brand-primary">{title}</h2>
              <span className="rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-accent">
                {price}
              </span>
            </div>
            <p className="mt-2 text-sm text-brand-muted">
              {applyRussianNbsp(
                "Срок и условия доставки согласуем после подтверждения заказа и адреса объекта.",
              )}
            </p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {["Склад", "Погрузка", "Отправка"].map((item) => (
          <div
            key={item}
            className="allpools-placeholder rounded-[8px] border border-brand-border p-3"
          >
            <div className="h-[150px] rounded-[6px] border border-dashed border-brand-border bg-white/75" />
          </div>
        ))}
      </section>
    </Section>
  );
}
