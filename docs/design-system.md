# Avant Aqua Design System

## 1. Foundations

### Color tokens

- `--brand-primary`: основной текст и навигация.
- `--brand-accent`: CTA и акцентные значения.
- `--brand-surface`, `--brand-surface-alt`: фоновые плоскости.
- `--brand-hero`: тёмные секции.
- `--state-success`, `--state-warning`, `--state-danger`: статусы.

### Typography

- Заголовки: `.ds-title`.
- Подзаголовки: `.ds-subtitle`.
- Базовый шрифт задаётся в `body` через `--font-body`.

### Spacing and radii

- Spacing scale: `--space-*`.
- Радиусы: `--radius-xs/sm/md/lg/pill`.

### Motion

- `--duration-fast/base/slow`.
- `--ease-standard`.

## 2. Core primitives

- `src/components/ui/Button.tsx` — варианты `primary`, `secondary`, `ghost`, `inverse`; размеры `sm/md/lg`.
- `src/components/ui/Input.tsx` — единый инпут с фокусом.
- `src/components/ui/Card.tsx` — стандартная карточка.
- `src/components/ui/Container.tsx` — контейнер ширины `--container-xl`.
- `src/components/ui/Section.tsx` — секционные отступы и контейнер.

## 3. Section components

- `src/components/sections/PageIntro.tsx` — breadcrumb + title + intro.
- `src/components/sections/StatsGrid.tsx` — унифицированная сетка метрик.

## 4. Layout rules

- `Header` должен оставаться однострочным, минималистичным и sticky.
- `Footer` состоит из newsletter-части, колонок ссылок и нижней legal-строки.
- Новые экраны строятся через `Section` + `PageIntro` + `Card`.

## 5. Accessibility rules

- Все интерактивные элементы должны иметь заметный focus (`focus-ring`).
- Контраст текста не ниже WCAG AA для основного контента.
- Минимальный touch-target: 40px по высоте (кнопки/инпуты).

## 6. Anti-patterns

- Не использовать hardcoded hex в компонентах страниц.
- Не дублировать стили кнопок/полей вручную на страницах.
- Не добавлять новые layout-плашки в шапку без обновления дизайн-системы.

## 7. Storybook source of truth

- Foundations: `src/stories/foundations.stories.tsx`
- Primitives: `src/stories/button.stories.tsx`, `src/stories/input.stories.tsx`, `src/stories/card.stories.tsx`
- Запуск: `npm run storybook`
