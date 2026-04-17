# Пакет WordPress + WooCommerce (договор б/н от 15.04.2026)

В каталоге `wordpress-avant` лежат артефакты поставки: документация, дочерняя тема и плагин с логикой «Купить в один клик».

## Установка

1. Установите WordPress на хостинге Заказчика (PHP 8.0+, HTTPS, рабочий cron).
2. Установите родительскую тему **Twenty Twenty-One** с каталога тем WordPress.org.
3. Скопируйте папку `wp-content/themes/avant-shop-child` в каталог тем сайта и активируйте тему **Avant Shop Child**.
4. Установите и активируйте **WooCommerce**, пройдите мастер настройки.
5. Скопируйте папку `wp-content/plugins/avant-site-core` в каталог плагинов и активируйте **Avant Site Core**.
6. Включите хотя бы один способ оплаты без онлайн‑шлюза (**Безналичный расчёт** или **Оплата при доставке**), чтобы заказы из «одного клика» получали способ оплаты и корректно уходили в обработку WooCommerce.

## Локально посмотреть (без Docker)

Нужен обычный WordPress на PHP 8.0+ и MySQL/MariaDB. В репозитории только **`wp-content`** (тема и плагин) — ядро WP скачивается отдельно.

### Вариант 1 — Local (Windows/macOS)

1. Установите [Local](https://localwp.com/), создайте новый сайт (PHP 8.x, nginx или Apache).
2. Откройте папку сайта и в `app/public/wp-content/themes/` скопируйте папку `avant-shop-child` из этого репозитория (`wordpress-avant/wp-content/themes/avant-shop-child`).
3. В `app/public/wp-content/plugins/` скопируйте `avant-site-core` из `wordpress-avant/wp-content/plugins/avant-site-core`.
4. В админке: установите с WordPress.org тему **Twenty Twenty-One** → активируйте **Avant Shop Child** → установите **WooCommerce** → при необходимости активируйте **Avant Site Core**.
5. Нажмите **Open site** в Local.

### Вариант 2 — Laragon / OpenServer / XAMPP (Windows)

1. Создайте виртуальный хост и пустую папку сайта; распакуйте [архив WordPress](https://ru.wordpress.org/download/) в корень сайта, создайте базу в phpMyAdmin и пройдите установку в браузере.
2. Скопируйте в `wp-content/themes/` и `wp-content/plugins/` те же две папки из `wordpress-avant/wp-content/`, как в варианте с Local.
3. Активируйте **Twenty Twenty-One**, **Avant Shop Child**, **WooCommerce** (и при необходимости **Avant Site Core**).

### Вариант 3 — уже есть хостинг или другой локальный стек

Скопируйте `avant-shop-child` и `avant-site-core` в `wp-content` существующего WordPress и активируйте компоненты, как в разделе **«Установка»** выше.

## Внешний вид темы (референс Webflow)

Токены в [`wp-content/themes/avant-shop-child/assets/css/tokens.css`](wp-content/themes/avant-shop-child/assets/css/tokens.css) сведены к дизайн‑системе **Webflow** из `DESIGN.md` (цвет текста `#080808`, акцент **Webflow Blue** `#146ef5`, нейтральные серые, бордер `#d8d8d8`, радиусы 4–8px, 5‑слойная тень, кнопки с `translateX(6px)` при наведении). Шрифт **Inter** (Google Fonts) используется как замена **WF Visual Sans Variable** из референса.

## Главная страница

Шаблон `front-page.php` выводит блоки главной. В настройках «Настройки → Чтение» можно оставить «На главной отображать» статическую страницу и назначить любую страницу главной — шаблон темы для корня сайта по-прежнему подхватится как главная витрина.

## Документация

- [Матрица трассировки требований](docs/requirements-traceability.md)
- [Объём MVP и финала](docs/mvp-scope.md)
- [Согласованный стек плагинов](docs/plugin-stack.md)
- [Чек‑лист сдачи и переноса](docs/final-delivery-checklist.md)
- [Инструкция администратору](docs/admin-instrukciya.md)
- [Следующий шаг кода (патч для Agent mode)](docs/implementation-next-step.md)

Если среда Cursor в **Plan mode**, PHP/CSS из репозитория не меняются автоматически — откройте [implementation-next-step.md](docs/implementation-next-step.md) в **Agent mode** и примените файлы целиком.

## Смена родительской темы

Если используется другая классическая тема, в `style.css` дочерней темы измените строку `Template:` на slug родителя и при необходимости поправьте зависимость стиля в `inc/enqueue.php`.
