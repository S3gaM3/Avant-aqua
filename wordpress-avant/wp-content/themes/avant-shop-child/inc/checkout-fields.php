<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_filter('woocommerce_checkout_fields', static function (array $fields): array {
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return $fields;
    }
    if (isset($fields['billing']['billing_first_name'])) {
        $fields['billing']['billing_first_name']['label']       = __('Имя', 'avant-shop-child');
        $fields['billing']['billing_first_name']['placeholder'] = __('Как к вам обращаться', 'avant-shop-child');
        $fields['billing']['billing_first_name']['priority']    = 10;
    }
    if (isset($fields['billing']['billing_last_name'])) {
        $fields['billing']['billing_last_name']['required'] = false;
        $fields['billing']['billing_last_name']['class'][]   = 'avant-checkout-hidden';
        $fields['billing']['billing_last_name']['priority']  = 11;
    }
    foreach (['billing_company', 'billing_country', 'billing_address_1', 'billing_address_2', 'billing_city', 'billing_state', 'billing_postcode'] as $key) {
        if (isset($fields['billing'][$key])) {
            unset($fields['billing'][$key]);
        }
    }
    if (isset($fields['billing']['billing_phone'])) {
        $fields['billing']['billing_phone']['label']       = __('Телефон', 'avant-shop-child');
        $fields['billing']['billing_phone']['placeholder'] = __('+7…', 'avant-shop-child');
        $fields['billing']['billing_phone']['priority']    = 20;
        $fields['billing']['billing_phone']['required']    = true;
    }
    if (isset($fields['billing']['billing_email'])) {
        $fields['billing']['billing_email']['label']       = __('E-mail', 'avant-shop-child');
        $fields['billing']['billing_email']['placeholder'] = __('name@example.com', 'avant-shop-child');
        $fields['billing']['billing_email']['priority']    = 30;
        $fields['billing']['billing_email']['required']    = true;
    }
    if (isset($fields['order']['order_comments'])) {
        $fields['order']['order_comments']['label']       = __('Комментарий к заказу', 'avant-shop-child');
        $fields['order']['order_comments']['placeholder'] = __('Доставка, время звонка и т. п.', 'avant-shop-child');
        $fields['order']['order_comments']['priority']    = 40;
    }
    if (isset($fields['shipping']) && is_array($fields['shipping'])) {
        $fields['shipping'] = [];
    }
    return $fields;
}, 30);

add_filter('default_checkout_billing_country', static function ($country) {
    return apply_filters('avant_shop_child_minimal_checkout', true) ? 'RU' : $country;
});

add_action('woocommerce_checkout_create_order', static function (WC_Order $order): void {
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return;
    }
    if (! $order->get_billing_country()) {
        $order->set_billing_country('RU');
    }
    $first = (string) $order->get_billing_first_name();
    $last  = (string) $order->get_billing_last_name();
    if ($first !== '' && $last === '') {
        $order->set_billing_last_name($first);
    }
}, 20, 1);

add_action('wp_enqueue_scripts', static function (): void {
    if (! function_exists('is_checkout') || ! is_checkout() || is_order_received_page()) {
        return;
    }
    if (! apply_filters('avant_shop_child_minimal_checkout', true)) {
        return;
    }
    $handle = 'avant-shop-checkout';
    wp_register_style($handle, false, [], null);
    wp_enqueue_style($handle);
    wp_add_inline_style(
        $handle,
        '.avant-checkout-hidden{position:absolute!important;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}'
    );
}, 100);
