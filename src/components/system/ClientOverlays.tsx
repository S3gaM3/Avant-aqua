"use client";

import { ClientToaster } from "@/components/system/ClientToaster";
import { CookieBanner } from "@/components/system/CookieBanner";

export function ClientOverlays() {
  return (
    <>
      <CookieBanner />
      <ClientToaster />
    </>
  );
}
