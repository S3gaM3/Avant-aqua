<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('customize_register', static function (WP_Customize_Manager $wp_customize): void {
    $wp_customize->add_section(
        'avant_contact',
        [
            'title'       => __('Контакты и заявки', 'avant-shop-child'),
            'description' => __('Телефон и e‑mail показываются на главной; адрес получателя — для писем с формы заявки.', 'avant-shop-child'),
            'priority'    => 40,
        ]
    );

    $wp_customize->add_setting(
        'avant_phone',
        [
            'type'              => 'theme_mod',
            'default'           => '',
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => static fn ($v): string => sanitize_text_field((string) $v),
        ]
    );
    $wp_customize->add_control(
        'avant_phone_control',
        [
            'type'     => 'text',
            'section'  => 'avant_contact',
            'settings' => 'avant_phone',
            'label'    => __('Телефон для сайта', 'avant-shop-child'),
        ]
    );

    $wp_customize->add_setting(
        'avant_public_email',
        [
            'type'              => 'theme_mod',
            'default'           => '',
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_email',
        ]
    );
    $wp_customize->add_control(
        'avant_public_email_control',
        [
            'type'     => 'email',
            'section'  => 'avant_contact',
            'settings' => 'avant_public_email',
            'label'    => __('E‑mail для отображения', 'avant-shop-child'),
        ]
    );

    $wp_customize->add_setting(
        'avant_contact_recipient',
        [
            'type'              => 'theme_mod',
            'default'           => '',
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => 'sanitize_email',
        ]
    );
    $wp_customize->add_control(
        'avant_contact_recipient_control',
        [
            'type'        => 'email',
            'section'     => 'avant_contact',
            'settings'    => 'avant_contact_recipient',
            'label'       => __('Получатель заявок с формы', 'avant-shop-child'),
            'description' => __('Если пусто — используется e‑mail администратора сайта.', 'avant-shop-child'),
        ]
    );
});
