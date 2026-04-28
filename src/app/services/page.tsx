import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Полный список услуг в стиле allpools.",
};

const services = [
  "Проектирование и дизайн",
  "Бассейн под ключ",
  "Сауны и бани",
  "Хаммамы",
  "Купели",
  "SPA-зона под ключ",
  "Бассейны и сауны в Крыму",
  "Оборудование OSPA",
  "Вентиляция в бассейнах",
  "Бассейн с подъемным дном",
  "Флоатинг",
  "Сервисное обслуживание",
];

export default function ServicesPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro
        title="Услуги"
        current="Услуги"
        description="Полный спектр услуг проектирования и строительства бассейнов, саун и SPA-зон."
      />
      <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service) => (
          <Card key={service} className="p-4">
            <div className="allpools-placeholder rounded-[6px] border border-brand-border p-2">
              <div className="h-[120px] rounded-[4px] border border-dashed border-brand-border bg-white/75" />
            </div>
            <h2 className="mt-3 text-base font-semibold text-brand-primary">{service}</h2>
            <p className="mt-2 text-sm text-brand-muted">
              Описание раздела и ключевые параметры проекта.
            </p>
          </Card>
        ))}
      </section>
    </Section>
  );
}
