<?php
/**
 * Архив товаров и страница магазина.
 *
 * @package AvantShopChild
 * @see woocommerce/templates/archive-product.php
 */

declare(strict_types=1);

defined('ABSPATH') || exit;

get_header('shop');

/**
 * Hook: woocommerce_before_main_content.
 */
do_action('woocommerce_before_main_content');

/**
 * Hook: woocommerce_shop_loop_header.
 *
 * @since 8.6.0
 */
do_action('woocommerce_shop_loop_header');

if (woocommerce_product_loop()) {
    /**
     * Hook: woocommerce_before_shop_loop.
     */
    do_action('woocommerce_before_shop_loop');

    woocommerce_product_loop_start();

    if (wc_get_loop_prop('total')) {
        while (have_posts()) {
            the_post();

            /**
             * Hook: woocommerce_shop_loop.
             */
            do_action('woocommerce_shop_loop');

            wc_get_template_part('content', 'product');
        }
    }

    woocommerce_product_loop_end();

    /**
     * Hook: woocommerce_after_shop_loop.
     */
    do_action('woocommerce_after_shop_loop');
} else {
    /**
     * Hook: woocommerce_no_products_found.
     */
    do_action('woocommerce_no_products_found');
}

/**
 * Hook: woocommerce_after_main_content.
 */
do_action('woocommerce_after_main_content');

/**
 * Hook: woocommerce_sidebar.
 */
do_action('woocommerce_sidebar');

get_footer('shop');
