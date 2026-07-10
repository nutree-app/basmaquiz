import { PRODUCT_LINKS } from "./config";
import { ProductKey } from "./types";

export interface Product {
  key: ProductKey;
  title: string;
  price?: string;
  badge?: string;
  description: string;
  link: string;
  buttonLabel: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  CUTTING_PACKAGE: {
    key: "CUTTING_PACKAGE",
    title: "باقة التنشيف",
    description: "خطة تمرين وتغذية متكاملة تناسب هدفك في التنشيف وخسارة الدهون.",
    link: PRODUCT_LINKS.CUTTING_PACKAGE,
    buttonLabel: "اختاري باقة التنشيف",
  },
  TALATI_GHEIR: {
    key: "TALATI_GHEIR",
    title: "بكج طلتي غير",
    badge: "الأفضل لك",
    description:
      "متابعة لمدة 3 أشهر، وتشمل الجداول كاملة، الخطة الغذائية، والملفات الإضافية المجانية.",
    link: PRODUCT_LINKS.TALATI_GHEIR,
    buttonLabel: "اختاري بكج طلتي غير",
  },
  GYM_TABLE: {
    key: "GYM_TABLE",
    title: "جدول النادي",
    description: "جدول تمارين تفصيلي للتمرين في النادي حسب هدفك ومستواك.",
    link: PRODUCT_LINKS.GYM_TABLE,
    buttonLabel: "اختاري جدول النادي",
  },
  HOME_TABLE: {
    key: "HOME_TABLE",
    title: "جدول المنزل",
    description: "جدول تمارين تفصيلي للتمرين في المنزل حسب هدفك ومستواك.",
    link: PRODUCT_LINKS.HOME_TABLE,
    buttonLabel: "اختاري جدول المنزل",
  },
  FULL_PACKAGE: {
    key: "FULL_PACKAGE",
    title: "بكج التمارين الشامل",
    price: "87 ريال",
    badge: "الأفضل",
    description:
      "يشمل جميع الجداول: المنزل، النادي، والبيلاتس، معك بكل خطوة، وجميع التمارين مشروحة بالفيديو.",
    link: PRODUCT_LINKS.FULL_PACKAGE,
    buttonLabel: "اختاري بكج التمارين الشامل",
  },
};
