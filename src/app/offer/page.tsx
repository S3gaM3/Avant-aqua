import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Договор оферты",
};

export default function OfferPage() {
  return (
    <Section className="bg-brand-surface" containerClassName="max-w-[var(--container-md)]">
      <PageIntro title="Договор оферты" current="Оферта" />
      <div className="mt-10 space-y-6 text-brand-muted">
        <p>
          Разместите здесь утверждённый юристами текст оферты на продажу товаров дистанционным
          способом. Для интернет‑магазина на WooCommerce текст обычно дублируют на отдельной
          странице и дают ссылку в процессе оформления заказа.
        </p>
        <p>
          Рекомендуется синхронизировать реквизиты ООО «Авант», режим работы и порядок оплаты с
          учётной системой и договором с эквайером.
        </p>
      </div>
    </Section>
  );
}
