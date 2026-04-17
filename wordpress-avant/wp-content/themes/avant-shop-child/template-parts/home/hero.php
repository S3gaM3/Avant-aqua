<?php
/**
 * Блок оффера на главной.
 *
 * @package AvantShopChild
 */
get_template_part('template-parts/home/hero-slider');
?>
<section class="avant-hero" aria-labelledby="avant-hero-title">
    <div class="avant-hero__inner">
        <h1 id="avant-hero-title" class="avant-hero__title">
            <?php esc_html_e('Подбор и поставка оборудования для бассейнов и СПА‑комплексов', 'avant-shop-child'); ?>
        </h1>
        <p class="avant-hero__lead">
            <?php esc_html_e('Каталог оборудования, корзина и оформление заказа на сайте — как привычный сервис «Авант», в новой витрине.', 'avant-shop-child'); ?>
        </p>
        <?php if (function_exists('wc_get_page_permalink')) : ?>
            <p class="avant-hero__cta">
                <a class="avant-btn avant-btn--primary" href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>">
                    <?php esc_html_e('В каталог', 'avant-shop-child'); ?>
                </a>
                <a class="avant-btn avant-btn--ghost" href="#avant-contacts-title">
                    <?php esc_html_e('Получить консультацию', 'avant-shop-child'); ?>
                </a>
            </p>
        <?php endif; ?>
    </div>
</section>
