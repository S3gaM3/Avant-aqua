import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { StatsGrid } from "@/components/sections/StatsGrid";

export const metadata: Metadata = {
  title: "Галерея",
  description: "Примеры выполненных работ и объектов.",
};

const projects = [
  {
    title: "Частный бассейн с выходом на террасу",
    tag: "Частный объект",
    city: "Москва",
    details: "Комплектация фильтрации, подогрева и автоматического дозирования.",
  },
  {
    title: "СПА-зона в загородном доме",
    tag: "СПА",
    city: "Московская область",
    details: "Бассейн, душ впечатлений, насосная группа и сценарии управления.",
  },
  {
    title: "Общественный бассейн",
    tag: "Коммерческий объект",
    city: "ЦФО",
    details: "Проект с акцентом на стабильное качество воды при высокой нагрузке.",
  },
  {
    title: "Реконструкция чаши и инженерии",
    tag: "Модернизация",
    city: "Москва",
    details: "Замена изношенного оборудования без длительной остановки объекта.",
  },
  {
    title: "Бассейн для гостиничного комплекса",
    tag: "HoReCa",
    city: "Юг России",
    details: "Подбор оборудования, поставка и запуск по этапному плану.",
  },
  {
    title: "Сервисный проект 24/7",
    tag: "Обслуживание",
    city: "Москва и МО",
    details: "Регламентные работы, контроль параметров и оперативное реагирование.",
  },
];

export default function GalleryPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro
        title="Галерея проектов"
        current="Галерея"
        description="Подборка типовых кейсов по частным и коммерческим объектам. Для каждого проекта можно запросить состав оборудования, сроки и формат сервисного сопровождения."
      />
      <div className="mt-8">
        <StatsGrid
          items={[
            { value: "500+", label: "Реализованных проектов" },
            { value: "127", label: "Объектов на сервисе" },
            { value: "25+", label: "Лет практического опыта" },
          ]}
        />
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          return (
            <Card key={project.title} className="flex h-full min-h-[430px] flex-col p-6">
              <div className="flex h-[220px] items-center justify-center overflow-hidden rounded-[6px] border border-brand-border bg-brand-surface p-3">
                <div className="allpools-placeholder h-full w-full rounded-[6px] border border-dashed border-brand-border" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-brand-accent">
                {project.tag}
              </p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-brand-primary">
                {project.title}
              </h2>
              <p className="mt-2 text-sm text-brand-muted">{project.city}</p>
              <p className="mt-3 text-sm leading-relaxed text-brand-muted">{project.details}</p>
            </Card>
          );
        })}
      </div>

      <Card className="mt-12 p-6">
        <h3 className="font-heading text-xl font-semibold text-brand-primary">
          Нужен похожий проект?
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-brand-muted">
          Отправьте параметры объекта — подготовим ориентировочное решение и коммерческое
          предложение по этапам.
        </p>
        <Link
          href="/contacts"
          className="mt-4 inline-flex rounded-[6px] bg-brand-accent px-5 py-3 text-sm font-medium text-white transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a]"
        >
          Получить предложение
        </Link>
      </Card>
    </Section>
  );
}
