"use client";

import Script from "next/script";

export function ChatWidget() {
  const scriptUrl = process.env.NEXT_PUBLIC_CHAT_WIDGET_URL;
  if (!scriptUrl) return null;
  return <Script src={scriptUrl} strategy="lazyOnload" />;
}
