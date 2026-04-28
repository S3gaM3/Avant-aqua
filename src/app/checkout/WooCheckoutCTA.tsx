"use client";

export function WooCheckoutCTA({ href }: { href: string | undefined }) {
  if (!href) {
    return (
      <span className="inline-flex min-h-[48px] cursor-not-allowed items-center justify-center rounded-[6px] bg-brand-border px-8 py-3 text-base font-semibold text-brand-muted">
        Ссылка на оплату не настроена
      </span>
    );
  }
  return (
    <a
      href={href}
      target="_self"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center rounded-[6px] bg-brand-accent px-8 py-3 text-base font-semibold text-white shadow-card transition-transform hover:-translate-x-1.5 hover:bg-[#d24f0a]"
    >
      Перейти к оплате на WooCommerce
    </a>
  );
}
