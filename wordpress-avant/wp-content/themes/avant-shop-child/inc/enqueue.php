<?php
/**
 * Подключение стилей и скриптов.
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('wp_enqueue_scripts', static function (): void {
    $ver = wp_get_theme()->get('Version');

    wp_enqueue_style(
        'avant-font-inter',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap',
        [],
        null
    );

    wp_enqueue_style(
        'avant-shop-child',
        get_stylesheet_uri(),
        ['avant-font-inter', 'twenty-twenty-one-style'],
        $ver
    );

    wp_enqueue_style(
        'avant-shop-tokens',
        AVANT_SHOP_CHILD_URL . 'assets/css/tokens.css',
        ['avant-shop-child'],
        $ver
    );

    wp_enqueue_style(
        'avant-shop-main',
        AVANT_SHOP_CHILD_URL . 'assets/css/main.css',
        ['avant-shop-tokens'],
        $ver
    );

    if (class_exists('WooCommerce')) {
        wp_enqueue_style(
            'avant-shop-woocommerce',
            AVANT_SHOP_CHILD_URL . 'assets/css/woocommerce.css',
            ['avant-shop-main'],
            $ver
        );
    }

    wp_enqueue_script(
        'avant-shop-main',
        AVANT_SHOP_CHILD_URL . 'assets/js/main.js',
        [],
        $ver,
        true
    );
}, 20);
