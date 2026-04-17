# Следующий шаг разработки (патч для Agent mode)

Режим **Plan** в Cursor не позволяет менять PHP/CSS напрямую. Чтобы применить код ниже, переключитесь в **Agent** и вставьте файлы целиком, либо выполните правки вручную.

## 1. Подключить новые модули в теме

В файле [`wp-content/themes/avant-shop-child/functions.php`](../wp-content/themes/avant-shop-child/functions.php) после существующих `require_once` добавьте:

```php
require_once AVANT_SHOP_CHILD_PATH . 'inc/catalog-orderby.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/checkout-fields.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/customizer-home.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/woocommerce-layout.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/blocks-patterns.php';
```

## 2. Новый файл `inc/catalog-orderby.php`

Подписи сортировки каталога («По новизне» для `date`).

```php
<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter('woocommerce_catalog_orderby', static function (array $orderby): array {
    if (isset($orderby['date'])) {
        $orderby['date'] = __('По новизне', 'avant-shop-child');
    }
    if (isset($orderby['price'])) {
        $orderby['price'] = __('По цене: сначала дешёвые', 'avant-shop-child');
    }
    if (isset($orderby['price-desc'])) {
        $orderby['price-desc'] = __('По цене: сначала дорогие', 'avant-shop-child');
    }
    return $orderby;
}, 20);
```

## 3. Новый файл `inc/checkout-fields.php`

Упрощение **классического** shortcode‑checkout под поля ТЗ. Для **блочного** checkout WooCommerce фильтры не действуют — используйте классическую страницу оформления или плагин полей.

```php
<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter('woocommerce_checkout_fields', static function (array $fields): array {
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return $fields;
    }
    if (isset($fields['billing']['billing_first_name'])) {
        $fields['billing']['billing_first_name']['label']       = __('Имя', 'avant-shop-child');
        $fields['billing']['billing_first_name']['placeholder'] = __('Как к вам обращаться', 'avant-shop-child');
        $fields['billing']['billing_first_name']['priority']    = 10;
    }
    if (isset($fields['billing']['billing_last_name'])) {
        $fields['billing']['billing_last_name']['required'] = false;
        $fields['billing']['billing_last_name']['class'][]   = 'avant-checkout-hidden';
        $fields['billing']['billing_last_name']['priority']  = 11;
    }
    foreach (['billing_company', 'billing_country', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_state', 'billing_postcode'] as $key) {
        if (isset($fields['billing'][$key])) {
            unset($fields['billing'][$key]);
        }
    }
    if (isset($fields['billing']['billing_phone'])) {
        $fields['billing']['billing_phone']['label']       = __('Телефон', 'avant-shop-child');
        $fields['billing']['billing_phone']['placeholder'] = __('+7…', 'avant-shop-child');
        $fields['billing']['billing_phone']['priority']    = 20;
        $fields['billing']['billing_phone']['required']    = true;
    }
    if (isset($fields['billing']['billing_email'])) {
        $fields['billing']['billing_email']['label']       = __('E-mail', 'avant-shop-child');
        $fields['billing']['billing_email']['placeholder'] = __('name@example.com', 'avant-shop-child');
        $fields['billing']['billing_email']['priority']    = 30;
        $fields['billing']['billing_email']['required']    = true;
    }
    if (isset($fields['order']['order_comments'])) {
        $fields['order']['order_comments']['label']       = __('Комментарий к заказу', 'avant-shop-child');
        $fields['order']['order_comments']['placeholder'] = __('Доставка, время звонка и т. п.', 'avant-shop-child');
        $fields['order']['order_comments']['priority']    = 40;
    }
    if (isset($fields['shipping']) && is_array($fields['shipping'])) {
        $fields['shipping'] = [];
    }
    return $fields;
}, 30);

add_filter('default_checkout_billing_country', static function ($country) {
    return apply_filters('avant_shop_child_minimal_checkout', true) ? 'RU' : $country;
});

add_action('woocommerce_checkout_create_order', static function (WC_Order $order): void {
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return;
    }
    if (! $order->get_billing_country()) {
        $order->set_billing_country('RU');
    }
    $first = (string) $order->get_billing_first_name();
    $last  = (string) $order->get_billing_last_name();
    if ($first !== '' && $last === '') {
        $order->set_billing_last_name($first);
    }
}, 20, 1);

add_action('wp_enqueue_scripts', static function (): void {
    if (! function_exists('is_checkout') || ! is_checkout() || is_order_received_page()) {
        return;
    }
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return;
    }
    $handle = 'avant-shop-checkout';
    wp_register_style($handle, false, [], null);
    wp_enqueue_style($handle);
    wp_add_inline_style(
        $handle,
        '.avant-checkout-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}'
    );
}, 100);
```

Отключение упрощённого чекаута (например, если нужен полный адрес доставки):

```php
add_filter('avant_shop_child_minimal_checkout', '__return_false');
```

## 4. Новый файл `inc/customizer-home.php`

Слайдер до трёх изображений (медиа‑ID) и чекбокс **noindex** для тестового стенда.

```php
<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('customize_register', static function (WP_Customize_Manager $wp_customize): void {
    $wp_customize->add_section(
        'avant_home',
        [
            'title'       => __('Главная страница', 'avant-shop-child'),
            'description' => __('До трёх изображений для слайдера над оффером.', 'avant-shop-child'),
            'priority'    => 35,
        ]
    );

    for ($i = 1; $i <= 3; $i++) {
        $settingId = 'avant_slider_image_' . $i;
        $wp_customize->add_setting(
            $settingId,
            [
                'type'              => 'theme_mod',
                'capability'        => 'edit_theme_options',
                'sanitize_callback' => 'absint',
            ]
        );
        $wp_customize->add_control(
            new WP_Customize_Media_Control(
                $wp_customize,
                $settingId . '_control',
                [
                    'label'     => sprintf(__('Слайд %d', 'avant-shop-child'), $i),
                    'section'   => 'avant_home',
                    'mime_type' => 'image',
                    'settings'  => $settingId,
                ]
            )
        );
    }

    $wp_customize->add_setting(
        'avant_staging_noindex',
        [
            'type'              => 'theme_mod',
            'default'           => 0,
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => static fn ($v): int => (int) (bool) $v,
        ]
    );
    $wp_customize->add_control(
        'avant_staging_noindex_control',
        [
            'type'        => 'checkbox',
            'section'     => 'avant_home',
            'settings'    => 'avant_staging_noindex',
            'label'       => __('Закрыть сайт от индексации (тестовый стенд)', 'avant-shop-child'),
            'description' => __('Включает robots noindex,nofollow на витрине.', 'avant-shop-child'),
        ]
    );
});

add_filter('wp_robots', static function (array $robots): array {
    if (! (bool) get_theme_mod('avant_staging_noindex', false)) {
        return $robots;
    }
    $robots['noindex']  = true;
    $robots['nofollow'] = true;
    return $robots;
}, 20);
```

## 5. Новый файл `inc/woocommerce-layout.php`

```php
<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('woocommerce_before_main_content', static function (): void {
    echo '<div class="avant-shop-wrap">';
}, 5);

add_action('woocommerce_after_main_content', static function (): void {
    echo '</div>';
}, 50);
```

## 6. Новый файл `inc/blocks-patterns.php`

```php
<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('init', static function (): void {
    if (! function_exists('register_block_pattern')) {
        return;
    }

    register_block_pattern(
        'avant-shop-child/home-offer',
        [
            'title'       => __('Оффер главной (текст + кнопка)', 'avant-shop-child'),
            'description' => __('Заголовок, абзац и ссылка в каталог.', 'avant-shop-child'),
            'categories'  => ['featured', 'text'],
            'content'     => '<!-- wp:group {"layout":{"type":"constrained"}} -->
<div class="wp-block-group"><!-- wp:heading {"level":1} -->
<h1 class="wp-block-heading">' . esc_html__('Интернет‑магазин', 'avant-shop-child') . '</h1>
<!-- /wp:heading -->
<!-- wp:paragraph -->
<p>' . esc_html__('Каталог, корзина и оформление заказа на сайте.', 'avant-shop-child') . '</p>
<!-- /wp:paragraph -->
<!-- wp:buttons -->
<div class="wp-block-buttons"><!-- wp:button -->
<div class="wp-block-button"><a class="wp-block-button__link wp-element-button" href="/shop/">' . esc_html__('В каталог', 'avant-shop-child') . '</a></div>
<!-- /wp:button --></div>
<!-- /wp:buttons --></div>
<!-- /wp:group -->',
        ]
    );
});
```

## 7. Новый файл `template-parts/home/hero-slider.php`

```php
<?php
declare(strict_types=1);

$slides = [];
for ($i = 1; $i <= 3; $i++) {
    $id = (int) get_theme_mod('avant_slider_image_' . $i, 0);
    if ($id > 0) {
        $slides[] = $id;
    }
}

if ($slides === []) {
    return;
}
?>
<div class="avant-hero-slider" role="region" aria-label="<?php esc_attr_e('Слайды', 'avant-shop-child'); ?>">
    <div class="avant-hero-slider__track">
        <?php foreach ($slides as $attachmentId) : ?>
            <figure class="avant-hero-slider__slide">
                <?php echo wp_get_attachment_image($attachmentId, 'large', false, ['class' => 'avant-hero-slider__img', 'loading' => 'lazy', 'decoding' => 'async']); ?>
            </figure>
        <?php endforeach; ?>
    </div>
</div>
```

В начале [`template-parts/home/hero.php`](../wp-content/themes/avant-shop-child/template-parts/home/hero.php) (сразу после открывающего `<?php`) добавьте:

```php
get_template_part('template-parts/home/hero-slider');
```

## 8. Стили для `assets/css/main.css`

Добавьте в конец файла:

```css
.avant-shop-wrap {
    max-width: var(--avant-max-width);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--avant-space-2);
    padding-right: var(--avant-space-2);
}

.avant-hero-slider {
    margin-bottom: var(--avant-space-3);
}

.avant-hero-slider__track {
    display: flex;
    gap: var(--avant-space-2);
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    padding-bottom: 0.25rem;
}

.avant-hero-slider__slide {
    flex: 0 0 min(100%, 28rem);
    margin: 0;
    scroll-snap-align: start;
}

.avant-hero-slider__img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: var(--avant-radius);
    object-fit: cover;
}
```

## 9. Инструкция администратору

Создайте [`docs/admin-instrukciya.md`](admin-instrukciya.md) с разделами: товары и категории, атрибуты (производитель, цвет), главная и слайдер, формы (плагин), SEO‑плагин, чекбокс тестового стенда, «один клик» и способы оплаты.

---

После применения патча увеличьте `Version` в [`style.css`](../wp-content/themes/avant-shop-child/style.css) для сброса кэша стилей.
