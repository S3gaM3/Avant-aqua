import type { Metadata } from "next";
import { Inter, PT_Serif } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Analytics } from "@/components/system/Analytics";
import { AuthProvider } from "@/components/system/AuthProvider";
import { ChatWidget } from "@/components/system/ChatWidget";
import { CartSessionSync } from "@/components/system/CartSessionSync";
import { ClientOverlays } from "@/components/system/ClientOverlays";
import { RegisterServiceWorker } from "@/components/system/RegisterServiceWorker";
import { JsonLd } from "@/components/system/JsonLd";
import { CartProvider } from "@/context/cart-context";
import { siteConfig } from "@/lib/site-config";

const display = PT_Serif({
  variable: "--font-display",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.shortName} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    title: `${siteConfig.shortName} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    locale: "ru_RU",
    type: "website",
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background font-sans text-brand-text">
        <AuthProvider>
          <CartProvider>
            <CartSessionSync />
            <RegisterServiceWorker />
            <Analytics />
            <ChatWidget />
            <JsonLd
              data={{
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteConfig.name,
                url: siteConfig.url,
              }}
            />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <ClientOverlays />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
