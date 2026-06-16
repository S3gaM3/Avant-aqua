"use client";

import { useCallback, useEffect, useState } from "react";

export function useGalleryLightbox(itemCount: number) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const open = useCallback((index: number) => setActiveIndex(index), []);

  useEffect(() => {
    if (activeIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setActiveIndex((i) => (i === null ? null : (i + 1) % itemCount));
      if (e.key === "ArrowLeft")
        setActiveIndex((i) => (i === null ? null : (i - 1 + itemCount) % itemCount));
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeIndex, close, itemCount]);

  return { activeIndex, open, close, setActiveIndex };
}
