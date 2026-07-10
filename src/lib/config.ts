// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط صفحات المنتجات في متجر بسمة فت
// ضعي رابط كل منتج هنا
export const PRODUCT_LINKS = {
  CUTTING_PACKAGE: "PLACE_CUTTING_PACKAGE_URL_HERE",
  TALATI_GHEIR: "PLACE_TALATI_GHAIR_URL_HERE",
  GYM_TABLE: "PLACE_GYM_TABLE_URL_HERE",
  HOME_TABLE: "PLACE_HOME_TABLE_URL_HERE",
  FULL_PACKAGE: "PLACE_COMPLETE_TRAINING_PACKAGE_URL_HERE",
} as const;

export type ProductLinkKey = keyof typeof PRODUCT_LINKS;

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
