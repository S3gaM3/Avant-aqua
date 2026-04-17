<?php
/**
 * Подвал: быстрые ссылки на витрину + родительский подвал Twenty Twenty-One.
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}
?>
<div class="avant-site-footer">
    <div class="avant-site-footer__inner">
        <?php if (has_nav_menu('footer')) : ?>
            <?php
            wp_nav_menu(
                [
                    'theme_location' => 'footer',
                    'container'      => 'nav',
                    'container_class'=> 'avant-site-footer__menu-wrap',
                    'menu_class'     => 'avant-site-footer__menu',
                    'depth'          => 2,
                    'fallback_cb'    => false,
                ]
            );
            ?>
        <?php else : ?>
            <nav class="avant-site-footer__links" aria-label="<?php esc_attr_e('Навигация в подвале', 'avant-shop-child'); ?>">
                <?php if (function_exists('wc_get_page_permalink')) : ?>
                    <a href="<?php echo esc_url(wc_get_page_permalink('shop')); ?>"><?php esc_html_e('Каталог', 'avant-shop-child'); ?></a>
                    <?php
                    $cartId = function_exists('wc_get_page_id') ? (int) wc_get_page_id('cart') : 0;
                    if ($cartId > 0) :
                        ?>
                        <a href="<?php echo esc_url(wc_get_page_permalink('cart')); ?>"><?php esc_html_e('Корзина', 'avant-shop-child'); ?></a>
                    <?php endif; ?>
                    <?php
                    $checkoutId = function_exists('wc_get_page_id') ? (int) wc_get_page_id('checkout') : 0;
                    if ($checkoutId > 0) :
                        ?>
                        <a href="<?php echo esc_url(wc_get_page_permalink('checkout')); ?>"><?php esc_html_e('Оформление', 'avant-shop-child'); ?></a>
                    <?php endif; ?>
                <?php endif; ?>
                <a href="<?php echo esc_url(home_url('/')); ?>"><?php esc_html_e('Главная', 'avant-shop-child'); ?></a>
            </nav>
        <?php endif; ?>
        <p class="avant-site-footer__copy">
            <?php
            printf(
                /* translators: 1: year, 2: site name */
                esc_html__('© %1$s %2$s', 'avant-shop-child'),
                esc_html(gmdate('Y')),
                esc_html(get_bloginfo('name', 'display'))
            );
            ?>
        </p>
    </div>
</div>
<?php
require get_template_directory() . '/footer.php';
