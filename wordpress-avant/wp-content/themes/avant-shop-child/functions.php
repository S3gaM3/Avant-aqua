<?php
/**
 * Точка входа дочерней темы Avant Shop Child.
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('AVANT_SHOP_CHILD_PATH', trailingslashit(get_stylesheet_directory()));
define('AVANT_SHOP_CHILD_URL', trailingslashit(get_stylesheet_directory_uri()));

require_once AVANT_SHOP_CHILD_PATH . 'inc/setup.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/seo-lite.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/enqueue.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/woocommerce.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/catalog-orderby.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/checkout-fields.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/customizer-home.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/woocommerce-layout.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/blocks-patterns.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/customizer-contact.php';
require_once AVANT_SHOP_CHILD_PATH . 'inc/contact-form.php';
