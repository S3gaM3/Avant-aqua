<?php
/**
 * Заказ в один клик: кнопка, модальное окно, создание заказа WooCommerce.
 *
 * @package AvantSiteCore
 */

declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

final class Avant_Site_Core_One_Click_Order
{
    private static ?self $instance = null;

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }

        return self::$instance;
    }

    private function __construct()
    {
        add_action('woocommerce_after_add_to_cart_button', [$this, 'render_button'], 18);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_assets'], 25);
        add_action('wp_footer', [$this, 'render_modal'], 50);
        add_action('wp_ajax_avant_ocb_submit', [$this, 'handle_submit']);
        add_action('wp_ajax_nopriv_avant_ocb_submit', [$this, 'handle_submit']);
    }

    public function enqueue_assets(): void
    {
        if (! function_exists('is_product') || ! is_product()) {
            return;
        }

        $product = wc_get_product(get_queried_object_id());
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) {
            return;
        }

        $handle = 'avant-site-core-one-click';
        wp_enqueue_style(
            'avant-site-core-one-click',
            AVANT_SITE_CORE_URL . 'assets/css/one-click.css',
            [],
            AVANT_SITE_CORE_VERSION
        );

        wp_enqueue_script(
            $handle,
            AVANT_SITE_CORE_URL . 'assets/js/one-click.js',
            [],
            AVANT_SITE_CORE_VERSION,
            true
        );

        wp_localize_script($handle, 'avantOcb', [
            'ajaxUrl'   => admin_url('admin-ajax.php'),
            'nonce'     => wp_create_nonce('avant_ocb_submit'),
            'productId' => (string) $product->get_id(),
            'i18n'      => [
                'title'   => __('Купить в один клик', 'avant-site-core'),
                'name'    => __('Имя', 'avant-site-core'),
                'phone'   => __('Телефон', 'avant-site-core'),
                'email'   => __('E-mail', 'avant-site-core'),
                'submit'  => __('Отправить заказ', 'avant-site-core'),
                'close'   => __('Закрыть', 'avant-site-core'),
                'sending' => __('Отправка…', 'avant-site-core'),
                'error'   => __('Не удалось оформить заказ. Попробуйте ещё раз или оформите через корзину.', 'avant-site-core'),
            ],
        ]);
    }

    public function render_button(): void
    {
        if (! function_exists('is_product') || ! is_product()) {
            return;
        }

        $product = wc_get_product(get_queried_object_id());
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) {
            return;
        }

        echo '<div class="avant-one-click-wrap">';
        printf(
            '<button type="button" class="button avant-one-click" id="avant-ocb-open" data-product-id="%d" aria-haspopup="dialog" aria-expanded="false">%s</button>',
            (int) $product->get_id(),
            esc_html__('Купить в один клик', 'avant-site-core')
        );
        echo '</div>';
    }

    public function render_modal(): void
    {
        if (! function_exists('is_product') || ! is_product()) {
            return;
        }

        $product = wc_get_product(get_queried_object_id());
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) {
            return;
        }

        echo '<div id="avant-ocb-modal" class="avant-ocb-modal" hidden role="dialog" aria-modal="true" aria-labelledby="avant-ocb-title">';
        echo '<div class="avant-ocb-modal__backdrop" data-ocb-close></div>';
        echo '<div class="avant-ocb-modal__panel" role="document">';
        echo '<h2 id="avant-ocb-title" class="avant-ocb-modal__title">' . esc_html__('Купить в один клик', 'avant-site-core') . '</h2>';
        echo '<form id="avant-ocb-form" class="avant-ocb-form" novalidate>';
        echo '<p class="avant-ocb-field"><label for="avant-ocb-name">' . esc_html__('Имя', 'avant-site-core') . '</label>';
        echo '<input type="text" id="avant-ocb-name" name="name" required autocomplete="name" /></p>';
        echo '<p class="avant-ocb-field"><label for="avant-ocb-phone">' . esc_html__('Телефон', 'avant-site-core') . '</label>';
        echo '<input type="tel" id="avant-ocb-phone" name="phone" required autocomplete="tel" /></p>';
        echo '<p class="avant-ocb-field"><label for="avant-ocb-email">' . esc_html__('E-mail', 'avant-site-core') . '</label>';
        echo '<input type="email" id="avant-ocb-email" name="email" autocomplete="email" /></p>';
        echo '<p class="avant-ocb-message" id="avant-ocb-message" hidden></p>';
        echo '<p class="avant-ocb-actions">';
        echo '<button type="button" class="button" data-ocb-close>' . esc_html__('Закрыть', 'avant-site-core') . '</button>';
        echo '<button type="submit" class="button button-primary">' . esc_html__('Отправить заказ', 'avant-site-core') . '</button>';
        echo '</p></form></div></div>';
    }

    public function handle_submit(): void
    {
        if (! check_ajax_referer('avant_ocb_submit', 'nonce', false)) {
            wp_send_json_error(['message' => __('Ошибка безопасности.', 'avant-site-core')], 403);
        }

        $productId = isset($_POST['product_id']) ? absint((int) wp_unslash($_POST['product_id'])) : 0;
        $name      = isset($_POST['name']) ? sanitize_text_field((string) wp_unslash($_POST['name'])) : '';
        $phone     = isset($_POST['phone']) ? sanitize_text_field((string) wp_unslash($_POST['phone'])) : '';
        $email     = isset($_POST['email']) ? sanitize_email((string) wp_unslash($_POST['email'])) : '';

        if ($productId <= 0 || $name === '' || $phone === '') {
            wp_send_json_error(['message' => __('Заполните обязательные поля.', 'avant-site-core')], 400);
        }

        $product = wc_get_product($productId);
        if (! $product instanceof WC_Product || ! $product->is_purchasable()) {
            wp_send_json_error(['message' => __('Товар недоступен для заказа.', 'avant-site-core')], 400);
        }

        $order = wc_create_order(
            [
                'customer_id' => get_current_user_id(),
                'created_via' => 'one_click',
            ]
        );

        if (is_wp_error($order)) {
            wp_send_json_error(['message' => __('Не удалось создать заказ.', 'avant-site-core')], 500);
        }

        try {
            $order->add_product($product, 1);
            $order->set_billing_first_name($name);
            $order->set_billing_last_name($name);
            $order->set_billing_country('RU');
            $order->set_billing_phone($phone);

            if (is_email($email)) {
                $order->set_billing_email($email);
            }

            $gateway = $this->pick_offline_gateway();
            if ($gateway !== null) {
                $order->set_payment_method($gateway);
            }

            $order->set_customer_note(__('Заказ оформлен через «Купить в один клик».', 'avant-site-core'));
            $order->calculate_totals();
            $order->set_status('pending', __('Ожидает обработки (один клик).', 'avant-site-core'));
            $order->save();
        } catch (Throwable $e) {
            if (defined('WP_DEBUG') && WP_DEBUG) {
                error_log($e->getMessage()); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
            }

            wp_send_json_error(['message' => __('Не удалось создать заказ.', 'avant-site-core')], 500);
        }

        wp_send_json_success(
            [
                'order_id' => $order->get_id(),
                'message'  => __('Заказ создан. Мы свяжемся с вами.', 'avant-site-core'),
            ]
        );
    }

    private function pick_offline_gateway(): ?WC_Payment_Gateway
    {
        $gateways = WC()->payment_gateways()->payment_gateways();
        foreach (['bacs', 'cod', 'cheque'] as $id) {
            if (isset($gateways[$id]) && $gateways[$id]->is_available()) {
                return $gateways[$id];
            }
        }

        foreach ($gateways as $gateway) {
            if ($gateway instanceof WC_Payment_Gateway && $gateway->is_available()) {
                return $gateway;
            }
        }

        return null;
    }
}

/**
 * Публичная функция для вывода кнопки из темы (опционально).
 */
function avant_site_core_render_one_click_button(): void
{
    if (class_exists('Avant_Site_Core_One_Click_Order')) {
        Avant_Site_Core_One_Click_Order::instance()->render_button();
    }
}
