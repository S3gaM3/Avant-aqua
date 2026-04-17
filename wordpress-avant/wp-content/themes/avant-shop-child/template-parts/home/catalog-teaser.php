<?php
/**
 * Верхний уровень категорий каталога на главной (аналог блока «Каталог оборудования»).
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

if (! taxonomy_exists('product_cat')) {
    return;
}

$terms = get_terms(
    [
        'taxonomy'   => 'product_cat',
        'hide_empty' => true,
        'parent'     => 0,
        'number'     => 6,
        'orderby'    => 'count',
        'order'      => 'DESC',
    ]
);

if (is_wp_error($terms) || ! is_array($terms) || $terms === []) {
    return;
}

$terms = array_values(
    array_filter(
        $terms,
        static function ($t): bool {
            return $t instanceof WP_Term && $t->slug !== 'uncategorized';
        }
    )
);

if ($terms === []) {
    return;
}
?>
<section class="avant-home-section avant-catalog-teaser" aria-labelledby="avant-catalog-teaser-title">
    <div class="avant-home-section__inner">
        <h2 id="avant-catalog-teaser-title" class="avant-section-title">
            <?php esc_html_e('Каталог оборудования', 'avant-shop-child'); ?>
        </h2>
        <p class="avant-catalog-teaser__lead">
            <?php esc_html_e('Перейдите в раздел — на витрине показаны позиции с учётом наличия.', 'avant-shop-child'); ?>
        </p>
        <ul class="avant-catalog-teaser__grid">
            <?php foreach ($terms as $term) : ?>
                <?php
                $link = get_term_link($term);
                if (is_wp_error($link)) {
                    continue;
                }
                ?>
                <li class="avant-catalog-teaser__item">
                    <a class="avant-catalog-teaser__card" href="<?php echo esc_url($link); ?>">
                        <span class="avant-catalog-teaser__name"><?php echo esc_html($term->name); ?></span>
                        <span class="avant-catalog-teaser__meta">
                            <?php
                            printf(
                                /* translators: %s: number of products */
                                esc_html__('Товаров: %s', 'avant-shop-child'),
                                esc_html(number_format_i18n((int) $term->count))
                            );
                            ?>
                        </span>
                    </a>
                </li>
            <?php endforeach; ?>
        </ul>
    </div>
</section>
