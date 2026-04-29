import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { applyRussianNbsp } from "@/lib/ru-typography";

export const metadata: Metadata = {
  title: "Договор оферты",
};

export default function OfferPage() {
  return (
    <Section className="bg-brand-surface" containerClassName="max-w-[var(--container-md)]">
      <PageIntro title="Договор оферты" current="Оферта" />
      <div className="mt-10 space-y-6 text-brand-muted">
        <p>
          {applyRussianNbsp(
            "Этот раздел содержит публичную оферту на продажу товаров дистанционным способом. Оформляя заказ на сайте, вы подтверждаете согласие с условиями оферты.",
          )}
        </p>
        <p>
          {applyRussianNbsp(
            "В оферте фиксируются порядок оформления и оплаты заказа, условия доставки, гарантии и правила возврата. Актуальная версия документа действует с момента публикации на этой странице.",
          )}
        </p>
      </div>
    </Section>
  );
}
