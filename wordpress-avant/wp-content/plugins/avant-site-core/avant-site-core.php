<?php
/**
 * Plugin Name: Avant Site Core
 * Description: Купить в один клик и служебные хуки для сайта по договору б/н от 15.04.2026. Требуется WooCommerce.
 * Version: 1.0.2
 * Author: Поставка по договору
 * Text Domain: avant-site-core
 * Requires at least: 6.4
 * Requires PHP: 8.0
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

define('AVANT_SITE_CORE_PATH', plugin_dir_path(__FILE__));
define('AVANT_SITE_CORE_URL', plugin_dir_url(__FILE__));
define('AVANT_SITE_CORE_VERSION', '1.0.2');

require_once AVANT_SITE_CORE_PATH . 'includes/class-one-click-order.php';

add_action('plugins_loaded', static function (): void {
    if (! class_exists('WooCommerce')) {
        add_action('admin_notices', static function (): void {
            echo '<div class="notice notice-error"><p>';
            esc_html_e('Плагин Avant Site Core требует активированного WooCommerce.', 'avant-site-core');
            echo '</p></div>';
        });

        return;
    }

    Avant_Site_Core_One_Click_Order::instance();
});
