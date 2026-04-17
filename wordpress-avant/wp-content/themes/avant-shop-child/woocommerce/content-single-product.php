<?php
/**
 * Контент карточки товара (галерея, сводка, табы).
 *
 * @package AvantShopChild
 * @see woocommerce/templates/content-single-product.php
 */

declare(strict_types=1);

defined('ABSPATH') || exit;

global $product;

/**
 * Hook: woocommerce_before_single_product.
 */
do_action('woocommerce_before_single_product');

if (post_password_required()) {
    echo get_the_password_form(); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
    return;
}
?>
<div id="product-<?php the_ID(); ?>" <?php wc_product_class('avant-product', $product); ?>>

    <?php
    /**
     * Hook: woocommerce_before_single_product_summary.
     */
    do_action('woocommerce_before_single_product_summary');
    ?>

    <div class="summary entry-summary avant-product__summary">
        <?php
        /**
         * Hook: woocommerce_single_product_summary.
         */
        do_action('woocommerce_single_product_summary');
        ?>
    </div>

    <?php
    /**
     * Hook: woocommerce_after_single_product_summary.
     */
    do_action('woocommerce_after_single_product_summary');
    ?>
</div>

<?php do_action('woocommerce_after_single_product'); ?>
