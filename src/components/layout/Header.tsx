"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/context/cart-context";
import { isAuthOAuthConfigured } from "@/lib/env";
import { siteConfig } from "@/lib/site-config";

const mainNav = [
  { href: "/services", label: "Услуги" },
  { href: "/catalog", label: "Оборудование" },
  { href: "/gallery", label: "Галерея проектов" },
  { href: "/news", label: "О компании" },
  { href: "/contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { data: session, status } = useSession();
  const authEnabled = isAuthOAuthConfigured();

  const adminNav =
    session?.user?.wpIsAdmin === true ? [{ href: "/dev/marketing-health", label: "Админ" }] : [];

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-white/95 backdrop-blur">
      <Container className="h-[60px]">
        <div className="grid h-full grid-cols-[auto_1fr_auto] items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Авант — технологии очистки воды"
              width={138}
              height={36}
              priority
              className="h-7 w-auto"
            />
          </Link>

          <nav className="hidden items-center justify-center gap-6 lg:flex">
            {[...mainNav, ...adminNav].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-[var(--duration-fast)] hover:text-brand-accent ${
                  pathname === item.href ? "text-brand-accent" : "text-brand-primary"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 justify-self-end">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="hidden text-xs text-brand-muted md:inline"
            >
              {siteConfig.phoneDisplay}
            </a>
            <Link
              href="/cart"
              className="relative rounded-[var(--radius-sm)] border border-brand-border px-2.5 py-1.5 text-xs font-medium text-brand-primary"
            >
              Корзина
              {itemCount > 0 ? (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-accent px-1 text-[10px] text-white">
                  {itemCount}
                </span>
              ) : null}
            </Link>
            {status === "authenticated" && authEnabled ? (
              <Link
                href="/account"
                className="hidden rounded-[var(--radius-sm)] border border-brand-border px-2.5 py-1.5 text-xs font-medium text-brand-primary md:inline-flex"
              >
                Кабинет
              </Link>
            ) : authEnabled ? (
              <button
                type="button"
                onClick={() => signIn("wordpress", { callbackUrl: "/account" })}
                className="hidden rounded-[var(--radius-sm)] border border-brand-border px-2.5 py-1.5 text-xs font-medium text-brand-primary md:inline-flex"
              >
                Войти
              </button>
            ) : null}
            <Link
              href="/contacts"
              className="hidden rounded-[var(--radius-sm)] bg-brand-accent px-2.5 py-1.5 text-xs font-medium text-white md:inline-flex"
            >
              Расчет стоимости
            </Link>
            <button
              type="button"
              className="flex h-8 w-8 flex-col items-center justify-center gap-1 lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setOpen(!open)}
            >
              <span className="h-0.5 w-5 bg-brand-primary" />
              <span className="h-0.5 w-5 bg-brand-primary" />
              <span className="h-0.5 w-5 bg-brand-primary" />
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div className="border-t border-brand-border bg-white lg:hidden">
          <Container className="py-3">
            <nav className="flex flex-col">
              {[...mainNav, ...adminNav].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="py-2 text-sm font-medium text-brand-primary"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="mt-2 border-t border-brand-border pt-2">
              <a
                href={`tel:${siteConfig.phoneTel}`}
                className="block py-2 text-sm text-brand-muted"
              >
                {siteConfig.phoneDisplay}
              </a>
              <Link
                href="/contacts"
                className="block py-2 text-sm font-medium text-brand-primary"
                onClick={() => setOpen(false)}
              >
                Расчет стоимости
              </Link>
              {status === "authenticated" && authEnabled ? (
                <>
                  <Link
                    href="/account"
                    className="block py-2 text-sm font-medium text-brand-primary"
                    onClick={() => setOpen(false)}
                  >
                    Кабинет
                  </Link>
                  <button
                    type="button"
                    className="py-2 text-left text-sm font-medium text-brand-primary"
                    onClick={() => {
                      setOpen(false);
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    Выйти
                  </button>
                </>
              ) : authEnabled ? (
                <button
                  type="button"
                  className="py-2 text-left text-sm font-medium text-brand-primary"
                  onClick={() => {
                    setOpen(false);
                    signIn("wordpress", { callbackUrl: "/account" });
                  }}
                >
                  Войти
                </button>
              ) : null}
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
