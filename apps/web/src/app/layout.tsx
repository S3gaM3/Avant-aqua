import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { YandexMetrika } from "@/components/analytics/YandexMetrika";
import "./tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  manifest: "/site.webmanifest",
};

const metrikaPreconnect = "https://mc.yandex.ru";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const manrope = localFont({
  src: [
    {
      path: "../../public/fonts/manrope-cyrillic.woff2",
      weight: "400 800",
      style: "normal",
    },
    {
      path: "../../public/fonts/manrope-latin.woff2",
      weight: "400 800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <head>
        <link rel="dns-prefetch" href={metrikaPreconnect} />
        <link rel="preconnect" href={metrikaPreconnect} crossOrigin="anonymous" />
      </head>
      <body>
        {children}
        <YandexMetrika />
      </body>
    </html>
  );
}
