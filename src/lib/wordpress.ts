import { getWordPressUrl } from "@/lib/env";

export type WpPost = {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  date: string;
  link: string;
};

export type WpPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
};

const MOCK_NEWS: WpPost[] = [
  {
    id: 1,
    slug: "otkryli-servisnoe-okno-vesna-2026",
    title: { rendered: "Открыли сервисное окно на весну 2026" },
    excerpt: {
      rendered:
        "<p>Запустили плановые выезды по Москве и&nbsp;МО для подготовки частных и&nbsp;коммерческих объектов к&nbsp;сезону.</p>",
    },
    date: "2026-03-12",
    link: "/news/otkryli-servisnoe-okno-vesna-2026",
  },
  {
    id: 2,
    slug: "zavershili-modernizaciyu-spa-zony-v-istre",
    title: { rendered: "Завершили модернизацию СПА-зоны в Истре" },
    excerpt: {
      rendered:
        "<p>Обновили блок фильтрации, автоматику дозирования и&nbsp;добавили удалённый мониторинг параметров воды.</p>",
    },
    date: "2026-02-27",
    link: "/news/zavershili-modernizaciyu-spa-zony-v-istre",
  },
  {
    id: 3,
    slug: "kak-my-podbiraem-oborudovanie-pod-obyekt",
    title: { rendered: "Как мы подбираем оборудование под объект" },
    excerpt: {
      rendered:
        "<p>Показали рабочий подход: от&nbsp;брифа и&nbsp;гидравлического расчёта до&nbsp;сметы и&nbsp;плана запуска.</p>",
    },
    date: "2026-02-06",
    link: "/news/kak-my-podbiraem-oborudovanie-pod-obyekt",
  },
  {
    id: 4,
    slug: "novye-postavki-po-ozonirovaniyu-vody",
    title: { rendered: "Новые поставки по озонированию воды" },
    excerpt: {
      rendered:
        "<p>Расширили линейку генераторов озона для частных бассейнов, СПА и&nbsp;коммерческих объектов.</p>",
    },
    date: "2026-01-22",
    link: "/news/novye-postavki-po-ozonirovaniyu-vody",
  },
  {
    id: 5,
    slug: "reglament-obsluzhivaniya-chastnogo-basseyna",
    title: { rendered: "Регламент обслуживания частного бассейна" },
    excerpt: {
      rendered:
        "<p>Подготовили понятный график работ на&nbsp;месяц, квартал и&nbsp;сезон для стабильной эксплуатации без простоев.</p>",
    },
    date: "2025-12-18",
    link: "/news/reglament-obsluzhivaniya-chastnogo-basseyna",
  },
  {
    id: 6,
    slug: "zapustili-format-ekspress-rascheta",
    title: { rendered: "Запустили формат экспресс-расчёта проекта" },
    excerpt: {
      rendered:
        "<p>Теперь предварительный бюджет и&nbsp;базовую спецификацию можно получить быстрее — на&nbsp;старте проекта.</p>",
    },
    date: "2025-11-29",
    link: "/news/zapustili-format-ekspress-rascheta",
  },
];

const MOCK_NEWS_CONTENT: Record<string, string> = {
  "otkryli-servisnoe-okno-vesna-2026": `
    <p>Команда «Авант» открыла весеннее сервисное окно для объектов в Москве и Московской области. В первую очередь берём в график бассейны и СПА, которые выходят из зимнего режима или готовятся к повышенной нагрузке.</p>
    <p>В базовый выезд входят: диагностика насосной группы, ревизия фильтрации, проверка автоматики дозирования и корректировка рабочих параметров. По итогам выдаём короткий технический отчёт и рекомендации по обслуживанию на сезон.</p>
    <ul>
      <li>Фиксируем критичные риски до запуска объекта.</li>
      <li>Согласуем план закупки расходников заранее.</li>
      <li>Даём прогноз по бюджету обслуживания на 3–6 месяцев.</li>
    </ul>
    <p>Если хотите попасть в ближайшие слоты, оставьте заявку через раздел «Контакты» — инженер свяжется с вами и уточнит параметры объекта.</p>
  `,
  "zavershili-modernizaciyu-spa-zony-v-istre": `
    <p>Завершили проект модернизации частной СПА-зоны в Истринском районе. Заказчик обратился с задачей стабилизировать качество воды и снизить ручные операции персонала.</p>
    <p>В рамках проекта заменили узел предварительной фильтрации, обновили блок дозирования и внедрили удалённый мониторинг ключевых параметров. После пусконаладки провели обучение сотрудников по ежедневному регламенту.</p>
    <p>Результат первого месяца эксплуатации: система работает в штатном режиме, отклонений по воде не зафиксировано, время на рутинные операции заметно сократилось.</p>
  `,
  "kak-my-podbiraem-oborudovanie-pod-obyekt": `
    <p>Подбор оборудования начинаем не с каталога, а с режима эксплуатации объекта. Для нас важны: объём воды, график использования, требования к качеству и сценарии нагрузки.</p>
    <p>Далее делаем гидравлический расчёт и проверяем несколько конфигураций оборудования. На этом этапе формируем два варианта решения: базовый и расширенный — чтобы заказчик видел разницу по CAPEX и сервисным затратам.</p>
    <p>Финальный документ — спецификация с понятной структурой стоимости и сроков. Такой подход сокращает число доработок на этапе монтажа и помогает избежать лишних закупок.</p>
  `,
  "novye-postavki-po-ozonirovaniyu-vody": `
    <p>Получили новую партию оборудования для систем озонирования. В поставке — решения для частных бассейнов, СПА и объектов с более высокой производительностью.</p>
    <p>Перед отгрузкой помогаем выбрать модель по фактическому расходу воды и условиям монтажа. Для сложных объектов можем подготовить схему интеграции с существующей системой водоподготовки.</p>
    <p>По запросу доступны шеф-монтаж, пусконаладка и сервисное сопровождение после запуска.</p>
  `,
  "reglament-obsluzhivaniya-chastnogo-basseyna": `
    <p>Подготовили практический регламент обслуживания частного бассейна, которым пользуется наша сервисная команда. Документ помогает владельцу и персоналу не пропускать критичные операции.</p>
    <ul>
      <li>Еженедельно: визуальный осмотр, проверка фильтра и текущих параметров воды.</li>
      <li>Ежемесячно: обслуживание дозирующих узлов и ревизия автоматики.</li>
      <li>По сезону: расширенная диагностика, замена расходников и корректировка режимов.</li>
    </ul>
    <p>Если нужна адаптация под конкретный объект, можем подготовить персональный регламент с учётом вашей конфигурации оборудования.</p>
  `,
  "zapustili-format-ekspress-rascheta": `
    <p>Мы запустили формат экспресс-расчёта, чтобы заказчик быстрее получал ориентиры по бюджету и срокам. Формат подходит для стадии, когда нужно оценить проект до детальной проработки.</p>
    <p>На входе запрашиваем минимальный набор данных: тип объекта, объём воды, регион и контакт для уточнений. На выходе даём диапазон стоимости и список ключевых инженерных узлов.</p>
    <p>После подтверждения интереса переходим к техническому расчёту и формируем детальное коммерческое предложение.</p>
  `,
};

export async function fetchPosts(limit = 6): Promise<WpPost[]> {
  const base = getWordPressUrl();
  if (!base) return MOCK_NEWS.slice(0, limit);
  try {
    const url = `${base}/wp-json/wp/v2/posts?per_page=${limit}&_embed=1`;
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return MOCK_NEWS.slice(0, limit);
    const posts = (await res.json()) as WpPost[];
    if (!Array.isArray(posts) || posts.length === 0) {
      return MOCK_NEWS.slice(0, limit);
    }
    return posts;
  } catch {
    return MOCK_NEWS.slice(0, limit);
  }
}

export async function fetchPostBySlug(slug: string): Promise<
  | (WpPost & {
      content: { rendered: string };
    })
  | null
> {
  const base = getWordPressUrl();
  if (!base) {
    const post = MOCK_NEWS.find((p) => p.slug === slug);
    return post
      ? {
          ...post,
          content: {
            rendered:
              MOCK_NEWS_CONTENT[slug] ??
              "<p>Материал готовится к публикации. Подпишитесь на обновления или свяжитесь с нами за консультацией.</p>",
          },
        }
      : null;
  }
  try {
    const url = `${base}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      next: { revalidate: 600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const posts = (await res.json()) as (WpPost & {
      content: { rendered: string };
    })[];
    return posts[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchPageBySlug(slug: string): Promise<WpPage | null> {
  const base = getWordPressUrl();
  if (!base) return null;
  try {
    const url = `${base}/wp-json/wp/v2/pages?slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const pages = (await res.json()) as WpPage[];
    return pages[0] ?? null;
  } catch {
    return null;
  }
}
