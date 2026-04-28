"use client";

import { useState, useSyncExternalStore } from "react";

const KEY = "avant-cookie-consent";

export function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);
  const show = useSyncExternalStore(
    () => () => {},
    () => localStorage.getItem(KEY) !== "1",
    () => false,
  );

  if (!show || dismissed) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(96%,760px)] -translate-x-1/2 rounded-[8px] border border-brand-border bg-white p-4 shadow-card">
      <p className="text-sm text-brand-text">
        Мы используем cookie и аналитику для улучшения сервиса.
      </p>
      <button
        type="button"
        className="mt-3 rounded-[6px] bg-brand-accent px-4 py-2 text-sm font-medium text-white"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setDismissed(true);
        }}
      >
        Принять
      </button>
    </div>
  );
}
