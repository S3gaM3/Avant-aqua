declare global {
  interface Window {
    dataLayer?: unknown[];
    ym?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    VK?: {
      Retargeting?: {
        Goal: (goal: string) => void;
      };
    };
  }
}

export function trackEvent(event: string, payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...payload });
  if (typeof window.ym === "function" && process.env.NEXT_PUBLIC_YANDEX_METRICA_ID) {
    window.ym(Number(process.env.NEXT_PUBLIC_YANDEX_METRICA_ID), "reachGoal", event, payload);
  }
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, payload);
  }
  if (window.VK?.Retargeting?.Goal) {
    window.VK.Retargeting.Goal(event);
  }
}
