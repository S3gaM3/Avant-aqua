<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

/**
 * @return string
 */
function avant_contact_form_recipient(): string
{
    $fromMod = (string) get_theme_mod('avant_contact_recipient', '');
    if ($fromMod !== '' && is_email($fromMod)) {
        return $fromMod;
    }

    return (string) get_option('admin_email');
}

/**
 * @param array<string, string> $query_args
 */
function avant_contact_form_redirect(array $query_args): void
{
    $referer = wp_get_referer();
    $base    = $referer ? $referer : home_url('/');
    $url     = add_query_arg($query_args, $base);
    wp_safe_redirect($url);
    exit;
}

add_action('admin_post_avant_contact', 'avant_contact_form_handle');
add_action('admin_post_nopriv_avant_contact', 'avant_contact_form_handle');

function avant_contact_form_handle(): void
{
    if (! isset($_POST['avant_contact_nonce']) || ! wp_verify_nonce(sanitize_text_field(wp_unslash($_POST['avant_contact_nonce'])), 'avant_contact')) {
        avant_contact_form_redirect(['avant_error' => 'nonce']);
    }

    $honeypot = isset($_POST['avant_company']) ? sanitize_text_field(wp_unslash((string) $_POST['avant_company'])) : '';
    if ($honeypot !== '') {
        avant_contact_form_redirect(['avant_sent' => '1']);
    }

    $name    = isset($_POST['avant_name']) ? sanitize_text_field(wp_unslash((string) $_POST['avant_name'])) : '';
    $phone   = isset($_POST['avant_phone']) ? sanitize_text_field(wp_unslash((string) $_POST['avant_phone'])) : '';
    $email   = isset($_POST['avant_email']) ? sanitize_email(wp_unslash((string) $_POST['avant_email'])) : '';
    $message = isset($_POST['avant_message']) ? sanitize_textarea_field(wp_unslash((string) $_POST['avant_message'])) : '';

    if ($name === '' || $phone === '' || $message === '') {
        avant_contact_form_redirect(['avant_error' => 'required']);
    }

    if ($email !== '' && ! is_email($email)) {
        avant_contact_form_redirect(['avant_error' => 'email']);
    }

    $referer = wp_get_referer();

    $recipient = avant_contact_form_recipient();
    if ($recipient === '' || ! is_email($recipient)) {
        avant_contact_form_redirect(['avant_error' => 'config']);
    }

    $subject = sprintf(
        /* translators: %s: site name */
        __('Заявка с сайта: %s', 'avant-shop-child'),
        wp_specialchars_decode((string) get_bloginfo('name'), ENT_QUOTES)
    );

    $bodyLines = [
        __('Новая заявка с формы обратной связи.', 'avant-shop-child'),
        '',
        __('Имя:', 'avant-shop-child') . ' ' . $name,
        __('Телефон:', 'avant-shop-child') . ' ' . $phone,
    ];
    if ($email !== '') {
        $bodyLines[] = __('E-mail:', 'avant-shop-child') . ' ' . $email;
    }
    $bodyLines[] = '';
    $bodyLines[] = __('Сообщение:', 'avant-shop-child');
    $bodyLines[] = $message;
    $bodyLines[] = '';
    $bodyLines[] = __('Страница отправки:', 'avant-shop-child') . ' ' . ($referer ? $referer : home_url('/'));

    $body = implode("\n", $bodyLines);

    $headers = [];
    if ($email !== '') {
        $headers[] = 'Reply-To: ' . $email;
    }

    $sent = wp_mail($recipient, $subject, $body, $headers);

    if (! $sent) {
        avant_contact_form_redirect(['avant_error' => 'send']);
    }

    avant_contact_form_redirect(['avant_sent' => '1']);
}

add_shortcode('avant_contact_form', static function (): string {
    ob_start();

    $error = isset($_GET['avant_error']) ? sanitize_key((string) wp_unslash($_GET['avant_error'])) : '';
    $sent  = isset($_GET['avant_sent']) ? sanitize_key((string) wp_unslash($_GET['avant_sent'])) : '';

    $privacy = function_exists('get_privacy_policy_url') ? get_privacy_policy_url() : '';

    ?>
    <div class="avant-contact-form-wrap">
        <?php if ($sent === '1') : ?>
            <p class="avant-contact-form__notice avant-contact-form__notice--success" role="status">
                <?php esc_html_e('Спасибо! Заявка отправлена — мы свяжемся с вами.', 'avant-shop-child'); ?>
            </p>
        <?php endif; ?>

        <?php if ($error !== '') : ?>
            <p class="avant-contact-form__notice avant-contact-form__notice--error" role="alert">
                <?php
                if ($error === 'nonce') {
                    esc_html_e('Сессия устарела. Обновите страницу и отправьте форму ещё раз.', 'avant-shop-child');
                } elseif ($error === 'required') {
                    esc_html_e('Заполните имя, телефон и сообщение.', 'avant-shop-child');
                } elseif ($error === 'email') {
                    esc_html_e('Проверьте формат e‑mail.', 'avant-shop-child');
                } elseif ($error === 'config') {
                    esc_html_e('На сайте не настроен получатель писем. Обратитесь к администратору.', 'avant-shop-child');
                } elseif ($error === 'send') {
                    esc_html_e('Не удалось отправить письмо. Попробуйте позже или позвоните нам.', 'avant-shop-child');
                } else {
                    esc_html_e('Не удалось отправить заявку.', 'avant-shop-child');
                }
                ?>
            </p>
        <?php endif; ?>

        <form class="avant-contact-form" method="post" action="<?php echo esc_url(admin_url('admin-post.php')); ?>" novalidate>
            <input type="hidden" name="action" value="avant_contact" />
            <?php wp_nonce_field('avant_contact', 'avant_contact_nonce'); ?>

            <p class="avant-contact-form__field avant-contact-form__field--honeypot" aria-hidden="true">
                <label for="avant_company"><?php esc_html_e('Компания', 'avant-shop-child'); ?></label>
                <input type="text" name="avant_company" id="avant_company" value="" tabindex="-1" autocomplete="off" />
            </p>

            <p class="avant-contact-form__field">
                <label for="avant_name"><?php esc_html_e('Имя', 'avant-shop-child'); ?> <span class="avant-contact-form__req">*</span></label>
                <input type="text" name="avant_name" id="avant_name" required maxlength="120" autocomplete="name" />
            </p>

            <p class="avant-contact-form__field">
                <label for="avant_phone"><?php esc_html_e('Телефон', 'avant-shop-child'); ?> <span class="avant-contact-form__req">*</span></label>
                <input type="tel" name="avant_phone" id="avant_phone" required maxlength="40" autocomplete="tel" />
            </p>

            <p class="avant-contact-form__field">
                <label for="avant_email"><?php esc_html_e('E-mail', 'avant-shop-child'); ?></label>
                <input type="email" name="avant_email" id="avant_email" maxlength="120" autocomplete="email" />
            </p>

            <p class="avant-contact-form__field">
                <label for="avant_message"><?php esc_html_e('Сообщение', 'avant-shop-child'); ?> <span class="avant-contact-form__req">*</span></label>
                <textarea name="avant_message" id="avant_message" rows="5" required maxlength="4000"></textarea>
            </p>

            <p class="avant-contact-form__consent">
                <?php if ($privacy) : ?>
                    <?php esc_html_e('Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных в соответствии с', 'avant-shop-child'); ?>
                    <a href="<?php echo esc_url($privacy); ?>"><?php esc_html_e('политикой конфиденциальности', 'avant-shop-child'); ?></a>.
                <?php else : ?>
                    <?php esc_html_e('Нажимая «Отправить заявку», вы соглашаетесь на обработку персональных данных.', 'avant-shop-child'); ?>
                <?php endif; ?>
            </p>

            <p class="avant-contact-form__submit">
                <button type="submit" class="avant-btn avant-btn--primary"><?php esc_html_e('Отправить заявку', 'avant-shop-child'); ?></button>
            </p>
        </form>
    </div>
    <?php

    return (string) ob_get_clean();
});
