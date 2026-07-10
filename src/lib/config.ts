// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط صفحات المنتجات في متجر بسمة فت
// ضعي رابط كل برنامج هنا
export const PRODUCT_LINKS = {
  GYM: "PLACE_GYM_PRODUCT_URL_HERE",
  HOME: "PLACE_HOME_PRODUCT_URL_HERE",
} as const;

export type ProductLinkKey = keyof typeof PRODUCT_LINKS;

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
