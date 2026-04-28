# Storybook Workflow

## Commands

- Run locally: `npm run storybook`
- Build static docs: `npm run build-storybook`

## Structure

- `Foundations/*`: токены и базовые визуальные правила.
- `Primitives/*`: атомарные UI-компоненты.
- Следующие уровни (после расширения): `Navigation/*`, `Sections/*`, `Templates/*`.

## Authoring checklist

1. Добавить/изменить компонент в `src/components`.
2. Создать или обновить story в `src/stories`.
3. Проверить states:
   - default
   - hover/active (через args или псевдо-состояния в demo)
   - disabled
4. Проверить контраст и a11y addon.

## Conventions

- Не импортировать page-level данные в stories.
- Для story использовать deterministic mock props.
- Стили только через токены и примитивы дизайн-системы.
