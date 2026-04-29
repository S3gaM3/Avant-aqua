"use client";

import { useState } from "react";
import { applyRussianNbsp } from "@/lib/ru-typography";

const KEY = "avant-cookie-consent";

export function CookieBanner() {
  const [show, setShow] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem(KEY) !== "1" : false,
  );

  if (!show) return null;
  return (
    <div className="fixed bottom-4 left-1/2 z-[60] w-[min(96%,760px)] -translate-x-1/2 rounded-[8px] border border-brand-border bg-white p-4 shadow-card">
      <p className="text-sm text-brand-text">
        {applyRussianNbsp("Мы используем cookie и аналитику, чтобы улучшать сервис.")}
      </p>
      <button
        type="button"
        className="mt-3 rounded-[6px] bg-brand-accent px-4 py-2 text-sm font-medium text-white"
        onClick={() => {
          localStorage.setItem(KEY, "1");
          setShow(false);
        }}
      >
        Принять
      </button>
    </div>
  );
}
