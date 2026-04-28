export function AdvantageCompare() {
  const rows = [
    {
      aspect: "Подбор оборудования",
      typical: "По общему прайс-листу без учёта режима эксплуатации",
      avant: "Инженерный расчёт под объём, режим и нагрузку объекта",
    },
    {
      aspect: "Смета",
      typical: "Общая стоимость без детализации этапов",
      avant: "Прозрачная структура: поставка, монтаж, пусконаладка, сервис",
    },
    {
      aspect: "Сроки",
      typical: "Ориентировочные даты без контрольных точек",
      avant: "Этапный план и контроль исполнения по каждому блоку",
    },
    {
      aspect: "Сервис после запуска",
      typical: "Реактивная поддержка по факту проблем",
      avant: "Регламентное обслуживание и профилактика заранее",
    },
  ];

  return (
    <section className="border-y border-brand-border bg-white py-16 md:py-20">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading text-3xl font-bold text-brand-primary md:text-4xl">
          Что отличает проект с «Авант»
        </h2>
        <p className="mt-3 max-w-3xl text-brand-muted">
          Мы конкурируем не обещаниями, а управляемым результатом: прогнозируемые сроки, прозрачная
          смета и надёжная эксплуатация после запуска.
        </p>

        <div className="mt-10 overflow-hidden rounded-[8px] border border-brand-border bg-white shadow-card">
          <div className="grid grid-cols-3 border-b border-brand-border bg-brand-surface px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-brand-muted md:px-6">
            <p>Критерий</p>
            <p>Типичный подход</p>
            <p>Подход «Авант»</p>
          </div>
          {rows.map((row) => (
            <div
              key={row.aspect}
              className="grid grid-cols-1 gap-3 border-b border-brand-border px-4 py-4 md:grid-cols-3 md:gap-4 md:px-6"
            >
              <p className="font-medium text-brand-text">{row.aspect}</p>
              <p className="text-sm text-brand-muted">{row.typical}</p>
              <p className="text-sm text-brand-primary">{row.avant}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
