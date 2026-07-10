// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط الدفع المباشر من سلة (Salla Instant Purchase)
// ضعي رابط كل باقة هنا بعد إنشائه من لوحة تحكم سلة
export const SALLA_CHECKOUT_LINKS = {
  ONE_MONTH: "PUT_SALLA_INSTANT_CHECKOUT_ONE_MONTH_HERE",
  TALTI_GHEIR: "PUT_SALLA_INSTANT_CHECKOUT_TALTI_GHEIR_HERE",
  CHALLENGE_90: "PUT_SALLA_INSTANT_CHECKOUT_CHALLENGE_90_HERE",
} as const;

export type SallaCheckoutKey = keyof typeof SALLA_CHECKOUT_LINKS;

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
