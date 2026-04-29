import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { Button } from "@/components/ui/Button";
import { applyRussianNbsp } from "@/lib/ru-typography";

export default function OfflinePage() {
  return (
    <Section className="bg-brand-surface" containerClassName="max-w-[var(--container-md)]">
      <PageIntro title="Нет соединения" current="Офлайн" />
      <p className="mt-4 text-brand-muted">
        {applyRussianNbsp(
          "Проверьте интернет-соединение и обновите страницу. Основные статические страницы доступны офлайн.",
        )}
      </p>
      <div className="mt-6">
        <Button href="/" variant="primary">
          На главную
        </Button>
      </div>
    </Section>
  );
}
