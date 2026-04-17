<?php
/**
 * Страница одного товара.
 *
 * @package AvantShopChild
 * @see woocommerce/templates/single-product.php
 */

declare(strict_types=1);

defined('ABSPATH') || exit;

get_header('shop');

while (have_posts()) {
    the_post();
    wc_get_template_part('content', 'single-product');
}

get_footer('shop');
