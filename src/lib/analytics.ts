type EventPayload = Record<string, string | number | boolean | null | undefined>;

type DataLayerEntry = {
  event: string;
  [key: string]: unknown;
};

declare global {
  interface Window {
    dataLayer?: DataLayerEntry[];
    clarity?: (...args: unknown[]) => void;
  }
}

/**
 * Push a custom analytics event to every configured destination:
 * - `window.dataLayer` (picked up by GA4 / GTM)
 * - Microsoft Clarity (`window.clarity("event", ...)`)
 *
 * Safe to call anywhere: no-ops on the server and when a
 * destination script hasn't loaded (e.g. ad blockers).
 */
export function trackEvent(eventName: string, payload?: EventPayload): void {
  if (typeof window === "undefined") return;

  try {
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: eventName, ...payload });

    if (typeof window.clarity === "function") {
      window.clarity("event", eventName);
      for (const [key, value] of Object.entries(payload ?? {})) {
        if (value !== undefined && value !== null) {
          window.clarity("set", key, String(value));
        }
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.debug(`[trackEvent] ${eventName}`, payload ?? {});
    }
  } catch {
    // Analytics must never break the app.
  }
}
