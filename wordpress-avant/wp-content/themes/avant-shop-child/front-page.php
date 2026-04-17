<?php
/**
 * Главная страница: оффер, категории, популярные товары, преимущества, контакты.
 *
 * @package AvantShopChild
 */

get_header();

get_template_part('template-parts/home/hero');
get_template_part('template-parts/home/catalog-teaser');
get_template_part('template-parts/home/featured-products');
get_template_part('template-parts/home/benefits');
get_template_part('template-parts/home/contacts');

get_footer();
