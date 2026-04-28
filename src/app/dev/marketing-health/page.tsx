import type { Metadata } from "next";
import { MarketingHealthPanel } from "@/components/system/MarketingHealthPanel";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

export const metadata: Metadata = {
  title: "Админ: маркетинг",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MarketingHealthPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Служебная диагностика: маркетинг" current="Админ" />
      <p className="mt-3 text-sm text-brand-muted">
        Для администраторов WordPress: проверка abandoned cart и webhook.
      </p>
      <div className="mt-8">
        <MarketingHealthPanel />
      </div>
    </Section>
  );
}
