<?php
/**
 * Популярные товары на главной (shortcode WooCommerce).
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('WooCommerce') || ! function_exists('wc_get_page_permalink')) {
    return;
}
?>
<section class="avant-home-section avant-featured-products" aria-labelledby="avant-featured-title">
    <div class="avant-home-section__inner">
        <h2 id="avant-featured-title" class="avant-section-title">
            <?php esc_html_e('Популярные товары', 'avant-shop-child'); ?>
        </h2>
        <p class="avant-featured-products__lead">
            <?php esc_html_e('Подборка по продажам; полный ассортимент — в каталоге.', 'avant-shop-child'); ?>
        </p>
        <div class="avant-featured-products__shortcode woocommerce">
            <?php echo do_shortcode('[products limit="8" columns="4" orderby="popularity"]'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        </div>
        <p class="avant-featured-products__more">
            <a class="avant-btn avant-btn--ghost" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">
                <?php esc_html_e('Весь каталог', 'avant-shop-child'); ?>
            </a>
        </p>
    </div>
</section>
