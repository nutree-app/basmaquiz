// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط الدفع المباشر (Instant Checkout) لكل منتج في متجر بسمة فت
// ضعي رابط الدفع المباشر لكل منتج هنا - لا تستخدمي رابط صفحة المنتج العادية
export const PRODUCT_LINKS = {
  CUTTING_PACKAGE: "https://basmafit.com/payment/p157502344",
  BULKING_PACKAGE: "https://basmafit.com/payment/p17632844",
  TALATI_GHEIR: "https://basmafit.com/payment/p752379572",
  GYM_TABLE: "https://basmafit.com/payment/p327783420",
  HOME_TABLE: "https://basmafit.com/payment/p433554190",
  FULL_PACKAGE: "https://basmafit.com/payment/p479823947",
} as const;

export type ProductLinkKey = keyof typeof PRODUCT_LINKS;

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
