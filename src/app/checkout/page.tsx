import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { PageIntro } from "@/components/sections/PageIntro";
import { Button } from "@/components/ui/Button";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Оформление заказа на сайте с созданием заказа в WooCommerce через REST API.",
};

export default function CheckoutPage() {
  return (
    <Section className="bg-brand-surface">
      <PageIntro title="Оформление заказа" current="Оформление заказа" />
      <p className="mt-6 text-lg text-brand-muted">
        Вы заполняете данные на этой странице, а заказ создаётся в WooCommerce через REST API. После
        создания заказа можно перейти к оплате.
      </p>

      <div className="mt-10">
        <CheckoutForm />
      </div>

      <div className="mt-8">
        <Button href="/cart" variant="ghost">
          Назад в корзину
        </Button>
      </div>
    </Section>
  );
}
