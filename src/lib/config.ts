// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط صفحات المنتجات في متجر بسمة فت
// ضعي رابط كل منتج هنا
export const PRODUCT_LINKS = {
  CUTTING_PACKAGE: "https://basmafit.com/KjZBzRj",
  BULKING_PACKAGE: "https://basmafit.com/EZEGdKY",
  TALATI_GHEIR: "https://basmafit.com/برنامج-طلتي-غير/p752379572",
  GYM_TABLE: "https://basmafit.com/جدول-النادي/p327783420",
  HOME_TABLE: "https://basmafit.com/جدول-المنزل/p433554190",
  FULL_PACKAGE: "https://basmafit.com/بكج-التمارين-الشامل/p479823947",
} as const;

export type ProductLinkKey = keyof typeof PRODUCT_LINKS;

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
