import { PRODUCT_LINKS } from "./config";
import { ProductKey } from "./types";

export interface ProductFeature {
  label: string;
  included: boolean;
}

export interface Product {
  key: ProductKey;
  title: string;
  price: string;
  description: string;
  features: ProductFeature[];
  link: string;
  buttonLabel: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  CUTTING_PACKAGE: {
    key: "CUTTING_PACKAGE",
    title: "باقة التنشيف",
    price: "59 ريال",
    description: "خطة تمرين وتغذية متكاملة تناسب هدفك في التنشيف وخسارة الدهون.",
    features: [
      { label: "تمارين مقسمة على الأسبوع كامل", included: true },
      { label: "تشمل تمارين الجسم كامل", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "متابعة شخصية", included: true },
      { label: "نظام غذائي محسوب حسب الهدف", included: true },
    ],
    link: PRODUCT_LINKS.CUTTING_PACKAGE,
    buttonLabel: "اختاري باقة التنشيف",
  },
  BULKING_PACKAGE: {
    key: "BULKING_PACKAGE",
    title: "باقة التضخيم",
    price: "59 ريال",
    description: "خطة تمرين وتغذية متكاملة تناسب هدفك في التضخيم وزيادة الوزن.",
    features: [
      { label: "تمارين مقسمة على الأسبوع كامل", included: true },
      { label: "تشمل تمارين الجسم كامل", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "متابعة شخصية", included: true },
      { label: "نظام غذائي محسوب حسب الهدف", included: true },
    ],
    link: PRODUCT_LINKS.BULKING_PACKAGE,
    buttonLabel: "اختاري باقة التضخيم",
  },
  TALATI_GHEIR: {
    key: "TALATI_GHEIR",
    title: "برنامج طلتي غير",
    price: "87 ريال",
    description:
      "متابعة لمدة 3 أشهر، وتشمل الجداول كاملة، الخطة الغذائية، والملفات الإضافية المجانية.",
    features: [
      { label: "جدول تمارين كامل", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "متابعة لمدة 3 أشهر", included: true },
      { label: "نظام غذائي محسوب", included: true },
      { label: "خطة مناسبة للهدف", included: true },
    ],
    link: PRODUCT_LINKS.TALATI_GHEIR,
    buttonLabel: "اختاري برنامج طلتي غير",
  },
  GYM_TABLE: {
    key: "GYM_TABLE",
    title: "جدول تمارين النادي",
    price: "39 ريال",
    description: "جدول تمارين تفصيلي للتمرين في النادي حسب هدفك ومستواك.",
    features: [
      { label: "تمارين مقسمة على الأسبوع كامل", included: true },
      { label: "تشمل تمارين الجسم كامل", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "شرح التمارين بالصور", included: true },
      { label: "متابعة شخصية", included: false },
      { label: "نظام غذائي", included: false },
    ],
    link: PRODUCT_LINKS.GYM_TABLE,
    buttonLabel: "اختاري جدول تمارين النادي",
  },
  HOME_TABLE: {
    key: "HOME_TABLE",
    title: "جدول تمارين المنزل",
    price: "39 ريال",
    description: "جدول تمارين تفصيلي للتمرين في المنزل حسب هدفك ومستواك.",
    features: [
      { label: "تمارين مقسمة على الأسبوع كامل", included: true },
      { label: "تشمل تمارين الجسم كامل", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "شرح التمارين بالصور", included: true },
      { label: "متابعة شخصية", included: false },
      { label: "نظام غذائي", included: false },
    ],
    link: PRODUCT_LINKS.HOME_TABLE,
    buttonLabel: "اختاري جدول تمارين المنزل",
  },
  FULL_PACKAGE: {
    key: "FULL_PACKAGE",
    title: "بكج التمارين الشامل",
    price: "87 ريال",
    description:
      "يشمل جميع الجداول: المنزل، النادي، والبيلاتس، معك بكل خطوة، وجميع التمارين مشروحة بالفيديو.",
    features: [
      { label: "تمارين النادي", included: true },
      { label: "تمارين المنزل", included: true },
      { label: "تمارين مقسمة على الأسبوع", included: true },
      { label: "شرح التمارين بالفيديو", included: true },
      { label: "شرح التمارين بالصور", included: true },
    ],
    link: PRODUCT_LINKS.FULL_PACKAGE,
    buttonLabel: "اختاري بكج التمارين الشامل",
  },
};
