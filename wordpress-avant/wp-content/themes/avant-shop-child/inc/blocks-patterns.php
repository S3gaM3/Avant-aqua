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
