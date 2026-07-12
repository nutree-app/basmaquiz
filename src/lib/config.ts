// ============================================================
// إعدادات الدفع والتواصل - عدّلي هنا فقط
// Payment & contact configuration - edit only here
// ============================================================

// روابط صفحات تفاصيل المنتج العادية في متجر بسمة فت
// تُستخدم في: زر اختيار المنتج على صفحة نتيجة الاختبار (النهائية) - يفتح صفحة المنتج، وليس الدفع مباشرة
export const PRODUCT_LINKS = {
  CUTTING_PACKAGE: "https://basmafit.com/برنامج-التنشيف/p157502344",
  BULKING_PACKAGE: "https://basmafit.com/برنامج-التضخيم/p17632844",
  TALATI_GHEIR: "https://basmafit.com/برنامج-طلتي-غير/p752379572",
  GYM_TABLE: "https://basmafit.com/جدول-النادي/p327783420",
  HOME_TABLE: "https://basmafit.com/جدول-المنزل/p433554190",
  FULL_PACKAGE: "https://basmafit.com/بكج-التمارين-الشامل/p479823947",
} as const;

export type ProductLinkKey = keyof typeof PRODUCT_LINKS;

// روابط الدفع المباشر (Instant Checkout) لكل منتج
// تُستخدم فقط داخل رسالة الواتساب في شاشة نتيجة الاختبار - لا تُستخدم لأزرار صفحة النتيجة
export const PRODUCT_PAYMENT_LINKS: Record<ProductLinkKey, string> = {
  CUTTING_PACKAGE: "https://basmafit.com/payment/p157502344",
  BULKING_PACKAGE: "https://basmafit.com/payment/p17632844",
  TALATI_GHEIR: "https://basmafit.com/payment/p752379572",
  GYM_TABLE: "https://basmafit.com/payment/p327783420",
  HOME_TABLE: "https://basmafit.com/payment/p433554190",
  FULL_PACKAGE: "https://basmafit.com/payment/p479823947",
};

// رقم واتساب بسمة فت
export const WHATSAPP_NUMBER = "966559964709";

// نطاق الإنتاج - يُستخدم للروابط والميتاداتا، لا نستخدم localhost في أي مكان
export const SITE_URL = "https://plan.basmafit.com";
