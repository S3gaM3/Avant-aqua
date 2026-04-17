<?php
/**
 * Хуки WooCommerce: табы, кнопка «один клик» (разметка), прочее.
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

if (! class_exists('WooCommerce')) {
    return;
}

remove_action('woocommerce_sidebar', 'woocommerce_get_sidebar', 10);

add_filter(
    'woocommerce_breadcrumb_home_text',
    static function (): string {
        return __('Главная', 'avant-shop-child');
    }
);

add_filter(
    'woocommerce_breadcrumb_defaults',
    static function (array $defaults): array {
        $defaults['delimiter']   = ' <span class="avant-breadcrumb__sep" aria-hidden="true">›</span> ';
        $defaults['wrap_before'] = '<nav class="woocommerce-breadcrumb avant-breadcrumb" aria-label="' . esc_attr__('Хлебные крошки', 'avant-shop-child') . '">';
        $defaults['wrap_after']  = '</nav>';
        $defaults['before']      = '';
        $defaults['after']       = '';

        return $defaults;
    }
);

/**
 * Переименование табов карточки товара под формулировки ТЗ.
 */
add_filter('woocommerce_product_tabs', static function (array $tabs): array {
    if (isset($tabs['description'])) {
        $tabs['description']['title'] = __('Описание', 'avant-shop-child');
    }

    if (isset($tabs['additional_information'])) {
        $tabs['additional_information']['title'] = __('Характеристики', 'avant-shop-child');
    }

    return $tabs;
}, 98);

/**
 * Явная подпись «нет в наличии»; для остальных случаев оставляем текст WooCommerce (в т.ч. мало на складе).
 */
add_filter(
    'woocommerce_get_availability_text',
    static function (string $availability, $product): string {
        if (! is_object($product) || ! method_exists($product, 'is_in_stock')) {
            return $availability;
        }

        if (! $product->is_in_stock()) {
            return __('Нет в наличии', 'avant-shop-child');
        }

        return $availability;
    },
    20,
    2
);
