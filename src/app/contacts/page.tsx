import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { LeadForm } from "@/components/forms/LeadForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Контактные данные и офисы.",
};

const offices = [
  { city: "Москва", phone: "+7 (495) 787-01-07", note: "Центральный офис" },
  { city: "Краснодар", phone: "+7 (916) 645-09-83", note: "Региональный офис" },
  { city: "Геленджик", phone: "8 800 555-70-55", note: "Проектный офис" },
  { city: "Крым", phone: "+7 (978) 818-28-26", note: "Склад и логистика" },
];

export default function ContactsPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Контакты" current="Контакты" />

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <p className="text-sm text-brand-muted">Телефон</p>
          <a
            href={`tel:${siteConfig.phoneTel}`}
            className="mt-1 block text-2xl font-semibold text-brand-primary"
          >
            {siteConfig.phoneDisplay}
          </a>
          <p className="mt-4 text-sm text-brand-muted">Email</p>
          <a href={`mailto:${siteConfig.email}`} className="mt-1 block text-brand-primary">
            {siteConfig.email}
          </a>
          <p className="mt-4 text-sm text-brand-muted">{siteConfig.address}</p>
        </Card>
        <Card className="bg-brand-surface p-6">
          <LeadForm submitLabel="Отправить сообщение" />
        </Card>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {offices.map((office) => (
          <Card key={office.city} className="p-5">
            <h2 className="text-lg font-semibold text-brand-primary">{office.city}</h2>
            <p className="mt-1 text-sm text-brand-muted">{office.note}</p>
            <p className="mt-2 text-sm text-brand-primary">{office.phone}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="allpools-placeholder rounded-[8px] border border-brand-border p-3">
          <div className="h-[220px] rounded-[6px] border border-dashed border-brand-border bg-white/75" />
        </div>
        <div className="allpools-placeholder rounded-[8px] border border-brand-border p-3">
          <div className="h-[220px] rounded-[6px] border border-dashed border-brand-border bg-white/75" />
        </div>
      </section>
    </Section>
  );
}
