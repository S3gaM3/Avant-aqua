import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { applyRussianNbsp } from "@/lib/ru-typography";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <Section className="bg-brand-surface" containerClassName="max-w-[var(--container-md)]">
      <PageIntro title="Политика конфиденциальности" current="Политика конфиденциальности" />
      <div className="mt-10 space-y-6 text-brand-muted [&_strong]:text-brand-text">
        <p>
          {applyRussianNbsp(
            "Настоящая политика описывает, как ООО «Авант» обрабатывает персональные данные при использовании сайта в соответствии с требованиями Федерального закона №\u00a0152-ФЗ.",
          )}
        </p>
        <p>
          {applyRussianNbsp(
            "Мы обрабатываем только те данные, которые вы передаёте через формы сайта: имя, телефон, адрес электронной почты и текст сообщения. Также фиксируются технические данные, необходимые для стабильной работы сайта.",
          )}
        </p>
        <p>
          {applyRussianNbsp(
            "Цель обработки данных — принять и обработать заявку, связаться с вами по вопросам заказа и предоставить консультацию по товарам и услугам компании.",
          )}
        </p>
        <p>
          {applyRussianNbsp(
            "Срок хранения персональных данных определяется требованиями законодательства и задачами обработки. По запросу вы можете уточнить состав ваших данных, а также направить обращение на их обновление или удаление.",
          )}
        </p>
      </div>
    </Section>
  );
}
