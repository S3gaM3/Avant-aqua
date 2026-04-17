<?php
/**
 * Лёгкие настройки заголовков без SEO‑плагина (MVP).
 *
 * @package AvantShopChild
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter(
    'document_title_separator',
    static function (): string {
        return '—';
    },
    10
);

add_filter(
    'document_title_parts',
    static function (array $title): array {
        if (
            function_exists('is_shop')
            && function_exists('wc_get_page_id')
            && is_shop()
            && ! is_search()
        ) {
            $shopId = (int) wc_get_page_id('shop');
            if ($shopId > 0) {
                $shopTitle = get_the_title($shopId);
                if (is_string($shopTitle) && $shopTitle !== '') {
                    $title['title'] = $shopTitle;
                }
            }
        }

        return $title;
    },
    20
);
