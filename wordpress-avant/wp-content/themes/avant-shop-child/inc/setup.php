<?php
/**
 * Поддержка темы, меню, размеры изображений.
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('after_setup_theme', static function (): void {
    load_child_theme_textdomain('avant-shop-child', get_stylesheet_directory() . '/languages');

    add_theme_support('automatic-feed-links');
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support(
        'html5',
        [
            'search-form',
            'comment-form',
            'comment-list',
            'gallery',
            'caption',
            'style',
            'script',
        ]
    );
    add_theme_support('responsive-embeds');
    add_theme_support('woocommerce', [
        'thumbnail_image_width' => 450,
        'single_image_width'    => 800,
    ]);
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    register_nav_menus([
        'primary' => __('Главное меню', 'avant-shop-child'),
        'footer'  => __('Меню в подвале', 'avant-shop-child'),
    ]);

    add_image_size('avant_catalog', 480, 480, true);
});
