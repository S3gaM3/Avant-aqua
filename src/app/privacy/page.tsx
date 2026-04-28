import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";

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
          Настоящий документ описывает принципы обработки персональных данных при использовании
          сайта ООО «Авант» в соответствии с Федеральным законом № 152‑ФЗ.
        </p>
        <p>
          Мы обрабатываем только те данные, которые вы указываете в формах обратной связи (имя,
          телефон, адрес электронной почты, текст сообщения), а также технические данные,
          необходимые для работы сайта (журналы сервера в обезличенном виде — по необходимости).
        </p>
        <p>
          Цель обработки — обработка заявок и коммуникация по оборудованию и услугам компании. Срок
          хранения определяется законодательством и договорными обязательствами; по запросу вы
          можете уточнить статус своих данных.
        </p>
        <p>
          Подробный текст согласия подставьте из юридического шаблона вашей организации или замените
          этот блок страницей из WordPress (страница с slug{" "}
          <code className="rounded bg-brand-surface px-1">privacy</code> может подтягиваться через
          REST API при необходимости).
        </p>
      </div>
    </Section>
  );
}
