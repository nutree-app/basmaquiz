type EventPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

// طبقة تتبع بسيطة تدفع الأحداث إلى dataLayer (متوافقة مع Google Tag Manager)
// عشان لاحقًا يسهل ربطها بأي أداة تحليلات بدون تعديل أماكن الاستدعاء
export function trackEvent(eventName: string, payload: EventPayload = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });

  if (process.env.NODE_ENV !== "production") {
    console.log(`[track] ${eventName}`, payload);
  }
}
