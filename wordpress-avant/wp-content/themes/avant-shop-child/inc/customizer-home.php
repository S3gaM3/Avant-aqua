<?php
declare(strict_types=1);

if (! defined('ABSPATH')) {
    exit;
}

add_action('customize_register', static function (WP_Customize_Manager $wp_customize): void {
    $wp_customize->add_section(
        'avant_home',
        [
            'title'       => __('Главная страница', 'avant-shop-child'),
            'description' => __('До трёх изображений для слайдера над оффером.', 'avant-shop-child'),
            'priority'    => 35,
        ]
    );

    for ($i = 1; $i <= 3; $i++) {
        $settingId = 'avant_slider_image_' . $i;
        $wp_customize->add_setting(
            $settingId,
            [
                'type'              => 'theme_mod',
                'capability'        => 'edit_theme_options',
                'sanitize_callback' => 'absint',
            ]
        );
        $wp_customize->add_control(
            new WP_Customize_Media_Control(
                $wp_customize,
                $settingId . '_control',
                [
                    'label'     => sprintf(__('Слайд %d', 'avant-shop-child'), $i),
                    'section'   => 'avant_home',
                    'mime_type' => 'image',
                    'settings'  => $settingId,
                ]
            )
        );
    }

    $wp_customize->add_setting(
        'avant_staging_noindex',
        [
            'type'              => 'theme_mod',
            'default'           => 0,
            'capability'        => 'edit_theme_options',
            'sanitize_callback' => static fn ($v): int => (int) (bool) $v,
        ]
    );
    $wp_customize->add_control(
        'avant_staging_noindex_control',
        [
            'type'        => 'checkbox',
            'section'     => 'avant_home',
            'settings'    => 'avant_staging_noindex',
            'label'       => __('Закрыть сайт от индексации (тестовый стенд)', 'avant-shop-child'),
            'description' => __('Включает robots noindex,nofollow на витрине.', 'avant-shop-child'),
        ]
    );
});

add_filter('wp_robots', static function (array $robots): array {
    if (! (bool) get_theme_mod('avant_staging_noindex', false)) {
        return $robots;
    }
    $robots['noindex']  = true;
    $robots['nofollow'] = true;
    return $robots;
}, 20);
