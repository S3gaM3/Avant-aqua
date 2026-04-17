<?php
/**
 * Контакты и форма заявки на главной (как блок «Поможем подобрать» на avant-aqua.ru).
 *
 * @package AvantShopChild
 */

$phone = (string) get_theme_mod('avant_phone', '');
$email = (string) get_theme_mod('avant_public_email', '');
?>
<section class="avant-contacts" aria-labelledby="avant-contacts-title">
    <div class="avant-contacts__inner">
        <h2 id="avant-contacts-title" class="avant-section-title">
            <?php esc_html_e('Поможем подобрать оборудование', 'avant-shop-child'); ?>
        </h2>
        <p class="avant-contacts__lead">
            <?php esc_html_e('Оставьте заявку — специалист свяжется с вами и подскажет по каталогу.', 'avant-shop-child'); ?>
        </p>

        <?php if ($phone !== '' || $email !== '') : ?>
            <ul class="avant-contacts__channels">
                <?php if ($phone !== '') : ?>
                    <li>
                        <span class="avant-contacts__label"><?php esc_html_e('Телефон', 'avant-shop-child'); ?></span>
                        <a class="avant-contacts__value" href="tel:<?php echo esc_attr(preg_replace('/\s+/', '', $phone)); ?>"><?php echo esc_html($phone); ?></a>
                    </li>
                <?php endif; ?>
                <?php if ($email !== '' && is_email($email)) : ?>
                    <li>
                        <span class="avant-contacts__label"><?php esc_html_e('E-mail', 'avant-shop-child'); ?></span>
                        <a class="avant-contacts__value" href="mailto:<?php echo esc_attr($email); ?>"><?php echo esc_html($email); ?></a>
                    </li>
                <?php endif; ?>
            </ul>
        <?php endif; ?>

        <div class="avant-contacts__form">
            <?php echo do_shortcode('[avant_contact_form]'); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
        </div>
    </div>
</section>
