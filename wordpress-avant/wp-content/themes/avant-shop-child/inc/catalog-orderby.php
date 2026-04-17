<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter('woocommerce_catalog_orderby', static function (array $orderby): array {
    if (isset($orderby['date'])) {
        $orderby['date'] = __('По новизне', 'avant-shop-child');
    }
    if (isset($orderby['price'])) {
        $orderby['price'] = __('По цене: сначала дешёвые', 'avant-shop-child');
    }
    if (isset($orderby['price-desc'])) {
        $orderby['price-desc'] = __('По цене: сначала дорогие', 'avant-shop-child');
    }
    return $orderby;
}, 20);
