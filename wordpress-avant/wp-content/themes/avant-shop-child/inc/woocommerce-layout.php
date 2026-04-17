<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('woocommerce_before_main_content', static function (): void {
    echo '<div class="avant-shop-wrap">';
}, 5);

add_action('woocommerce_after_main_content', static function (): void {
    echo '</div>';
}, 50);
