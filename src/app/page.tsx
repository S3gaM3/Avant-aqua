import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { StatsGrid } from "@/components/sections/StatsGrid";

const serviceTiles = [
  "Строительство бассейнов под ключ",
  "Проектирование и дизайн",
  "Строительство хаммамов",
  "Строительство саун и бань",
  "Строительство бассейнов и саун в Крыму",
  "Строительство бассейнов OSPA",
];

const metrics = [
  { value: "21", label: "Лет опыта строительства" },
  { value: "35", label: "Наград в конкурсах" },
  { value: "127", label: "Объектов на обслуживании" },
  { value: "500+", label: "Реализованных проектов" },
];

const steps = [
  "Вы оставляете заявку",
  "Консультация и предварительная смета",
  "Заключение договора",
  "Дизайн-проект, технический проект",
  "Строительство и сдача объекта в срок",
  "Гарантийное и сервисное обслуживание",
];

const portfolioItems = [
  "Бассейн с противотоком и джакузи",
  "Mriya Resort & SPA - Infinity бассейн",
  "Детский бассейн с песчаной пленкой",
  "Бассейн с декоративным мозаичным панно",
  "Golden Mile SPA",
];

export default function HomePage() {
  return (
    <>
      <section className="relative border-b border-brand-border">
        <div className="allpools-placeholder h-[440px] border-b border-brand-border md:h-[520px]" />
        <div className="pointer-events-none absolute inset-0 mx-auto flex w-full max-w-[var(--container-xl)] items-center px-4 sm:px-6 lg:px-8">
          <div className="pointer-events-auto w-full max-w-[620px] bg-brand-hero/95 p-5 text-white shadow-xl md:ml-10 md:p-8">
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Бассейны и сауны «под ключ»
            </h1>
            <p className="mt-4 text-base leading-relaxed text-white/95 md:text-lg">
              Строительство частных и общественных бассейнов, саун с купелью, хаммамов и комплексных
              spa-зон. Эксклюзивные дизайн-проекты. Мы строим «под ключ» — от котлована до сдачи
              объекта точно в срок.
            </p>
            <div className="mt-7">
              <Button href="/contacts" variant="inverse">
                Рассчитать стоимость
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Section className="border-b border-brand-border bg-brand-surface">
        <div className="mx-auto w-full max-w-[1040px]">
          <h2 className="text-center font-heading text-3xl font-bold uppercase text-[#1f2129] md:text-5xl">
            Бассейны и сауны <span className="text-[#b9965b]">«под ключ»</span>
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-center text-lg leading-snug text-[#2d3138] md:text-3xl">
            Мы строим и реконструируем бассейны и сауны уже более 21 лет от дизайн-проекта до сдачи
            объекта точно в срок
          </p>
          <div className="mx-auto mt-10 grid max-w-[980px] gap-5 md:grid-cols-2">
            {serviceTiles.map((title) => (
              <Card key={title} className="overflow-hidden">
                <div className="allpools-placeholder p-2">
                  <div className="h-[185px] rounded-[4px] border border-dashed border-[#cfd3da] bg-white/70" />
                </div>
                <h3 className="px-6 py-4 text-2xl font-semibold text-[#20242c] md:text-3xl">
                  {title}
                </h3>
              </Card>
            ))}
          </div>
          <div className="mx-auto mt-5 grid max-w-[980px] gap-5 md:grid-cols-2">
            <Card className="border-brand-accent p-8">
              <h3 className="text-3xl font-bold text-[#20242c] md:text-4xl">Все услуги →</h3>
              <p className="mt-3 text-lg text-[#2d3138] md:text-xl">
                Полный спектр услуг проектирования и строительства бассейнов, саун и spa зон
              </p>
              <div className="mt-7">
                <Button href="/services" variant="primary">
                  Подробнее
                </Button>
              </div>
            </Card>
            <Card className="border-brand-accent p-8">
              <h3 className="text-3xl font-bold text-[#20242c] md:text-4xl">Расчет стоимости →</h3>
              <p className="mt-3 text-lg text-[#2d3138] md:text-xl">
                Рассчитайте стоимость бассейна, сауны или хаммама и получите индивидуальное
                коммерческое предложение
              </p>
              <div className="mt-7">
                <Button href="/contacts" variant="primary">
                  Рассчитать
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section className="bg-brand-hero py-16 text-white md:py-20" containerClassName="text-center">
        <h2 className="font-heading text-4xl font-bold uppercase md:text-6xl">Дизайн-проект</h2>
        <p className="mx-auto mt-6 max-w-4xl text-lg leading-snug text-white/90 md:text-3xl">
          Наш дизайнер интерьеров поможет определиться со стилем и реализует в виде 3D-модели ваш
          будущий объект
        </p>
        <div className="mt-10">
          <Button href="/contacts" variant="primary">
            Консультация дизайнера
          </Button>
        </div>
      </Section>

      <Section
        className="border-b border-brand-border bg-brand-surface"
        containerClassName="text-center"
      >
        <h2 className="font-heading text-4xl font-bold text-[#20242c] md:text-6xl">
          Как мы работаем
        </h2>
        <p className="mt-4 text-lg text-[#2d3138] md:text-3xl">
          Наш подход к работе: от идеи до реализации
        </p>
        <ol className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {steps.map((step, i) => (
            <li key={step} className="rounded-md border border-[#dadce2] bg-white p-5">
              <div className="mx-auto h-14 w-14 rounded-full border-2 border-[#b9965b] bg-[#f8f1e4]" />
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.08em] text-[#b9965b]">
                Шаг {i + 1}
              </p>
              <p className="mt-2 text-sm text-[#20242c]">{step}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section
        className="border-b border-brand-border bg-brand-surface"
        containerClassName="text-center"
      >
        <div className="mx-auto w-full max-w-[1040px]">
          <h2 className="font-heading text-4xl font-bold uppercase text-[#1f2129] md:text-6xl">
            <span className="text-[#b9965b]">Avant Aqua</span> в цифрах
          </h2>
          <p className="mx-auto mt-5 max-w-4xl text-lg leading-snug text-[#2d3138] md:text-3xl">
            Наш опыт и профессионализм отражены в каждом объекте мы дорожим своей репутацией
          </p>
          <div className="mt-14 text-left">
            <StatsGrid items={metrics} />
          </div>
        </div>
      </Section>

      <Section className="border-b border-brand-border bg-brand-surface">
        <div className="text-center">
          <h2 className="font-heading text-4xl font-bold uppercase text-[#20242c] md:text-6xl">
            Мы гордимся <span className="text-[#b9965b]">нашей работой</span>
          </h2>
          <p className="mx-auto mt-4 max-w-4xl text-lg leading-snug text-[#2d3138] md:text-3xl">
            В нашем портфолио более 500 частных и общественных объектов в галерее представлены лишь
            некоторые из них
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {portfolioItems.map((project, i) => (
            <Card key={project} className="overflow-hidden border-[#cfd4dc]">
              <div className="allpools-placeholder p-2">
                <div className="h-[260px] rounded-[4px] border border-dashed border-[#cfd4dc] bg-white/75 md:h-[320px]" />
              </div>
              <p className="px-4 pb-4 text-xl font-semibold leading-snug text-[#20242c] md:text-2xl">
                {project}
              </p>
              <p className="px-4 pb-5 text-sm text-[#6b717b]">Проект #{i + 1}</p>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/gallery"
            className="text-lg font-semibold text-[#b9965b] hover:text-[#1f2129]"
          >
            Все проекты →
          </Link>
        </div>
      </Section>

      <Section className="bg-brand-hero py-8 text-white md:py-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-lg md:text-2xl">
              Будьте в курсе последних трендов в Бассейнах и SPA
            </p>
            <p className="mt-2 text-sm text-white/80">
              Мы не спамим! Лишь 2-3 полезных письма в месяц
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Введите email адрес"
              className="min-w-[280px] bg-white text-brand-text"
            />
            <Button href="/contacts" variant="inverse">
              Подписаться
            </Button>
          </div>
        </div>
      </Section>

      <Section className="bg-white py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto_auto] lg:items-start">
          <div>
            <p className="text-2xl font-semibold tracking-[0.2em] text-[#b9965b] md:text-4xl">
              AVANT AQUA
            </p>
            <p className="mt-4 text-3xl font-semibold text-[#1f2129] md:text-5xl">
              8 800 555-70-55
            </p>
            <p className="mt-4 max-w-md text-base text-[#2d3138] md:text-lg">
              Хотите рассчитать стоимость бассейна, сауны или хаммама? Оставьте заявку, и мы
              свяжемся с вами.
            </p>
          </div>
          <div className="grid gap-2 text-base text-[#2d3138] md:text-lg">
            <Link href="/services" className="hover:text-[#b9965b]">
              Услуги
            </Link>
            <Link href="/catalog" className="hover:text-[#b9965b]">
              Оборудование
            </Link>
            <Link href="/gallery" className="hover:text-[#b9965b]">
              Галерея проектов
            </Link>
            <Link href="/contacts" className="hover:text-[#b9965b]">
              Контакты
            </Link>
          </div>
          <div className="min-w-[220px]">
            <Button href="/contacts" variant="secondary">
              Обратный звонок
            </Button>
          </div>
        </div>
      </Section>

      <Section
        className="border-t border-brand-border bg-white py-5"
        containerClassName="flex flex-wrap items-center justify-between gap-2 text-sm text-[#6b717b]"
      >
        <p>© AVANT AQUA 2005 - 2026</p>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/privacy" className="hover:text-[#1f2129]">
            Политика конфиденциальности
          </Link>
          <Link href="/offer" className="hover:text-[#1f2129]">
            Оферта обслуживания
          </Link>
          <Link href="/contacts" className="hover:text-[#1f2129]">
            Вакансии
          </Link>
          <Link href="/contacts" className="hover:text-[#1f2129]">
            Ошибка на сайте?
          </Link>
        </div>
      </Section>
    </>
  );
}
