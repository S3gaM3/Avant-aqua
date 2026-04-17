<?php
declare(strict_types=1);

$slides = [];
for ($i = 1; $i <= 3; $i++) {
    $id = (int) get_theme_mod('avant_slider_image_' . $i, 0);
    if ($id > 0) {
        $slides[] = $id;
    }
}

if ($slides === []) {
    return;
}
?>
<div class="avant-hero-slider" role="region" aria-label="<?php esc_attr_e('Слайды', 'avant-shop-child'); ?>">
    <div class="avant-hero-slider__track">
        <?php foreach ($slides as $attachmentId) : ?>
            <figure class="avant-hero-slider__slide">
                <?php echo wp_get_attachment_image($attachmentId, 'large', false, ['class' => 'avant-hero-slider__img', 'loading' => 'lazy', 'decoding' => 'async']); ?>
            </figure>
        <?php endforeach; ?>
    </div>
</div>
