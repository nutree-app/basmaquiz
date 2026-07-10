import { ProductKey } from "./types";

export interface Product {
  key: ProductKey;
  title: string;
  link: string;
  price?: string;
  duration?: string;
  badge?: string;
  description: string;
  features?: string[];
  buttonLabel: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  CUTTING_PROGRAM: {
    key: "CUTTING_PROGRAM",
    title: "برنامج التنشيف",
    link: "https://basmafit.com/برنامج-التنشيف/p157502344",
    description: "برنامج تمرين وتغذية متكامل يركز على حرق الدهون وتنشيف الجسم.",
    buttonLabel: "اختاري برنامج التنشيف",
  },
  BULKING_PROGRAM: {
    key: "BULKING_PROGRAM",
    title: "برنامج التضخيم",
    link: "https://basmafit.com/برنامج-التضخيم/p17632844",
    description: "برنامج تمرين وتغذية متكامل يركز على زيادة الكتلة العضلية وبناء الجسم.",
    buttonLabel: "اختاري برنامج التضخيم",
  },
  TALTI_GHEIR: {
    key: "TALTI_GHEIR",
    title: "طلتي غير",
    link: "https://basmafit.com/برنامج-طلتي-غير/p752379572",
    duration: "3 شهور",
    badge: "الأكثر طلبا",
    description: "باقة شاملة بكل الملفات المطلوبة لنتائج أوضح خلال مدة أطول.",
    features: [
      "خطة تمرين حسب هدفك",
      "نظام غذائي مناسب",
      "متابعة وتوجيه",
      "جميع ملفات البرنامج",
      "مدة أطول لنتائج أوضح",
    ],
    buttonLabel: "اختاري طلتي غير",
  },
  GYM_SCHEDULE: {
    key: "GYM_SCHEDULE",
    title: "جدول النادي",
    link: "https://basmafit.com/جدول-النادي/p327783420",
    description: "جدول تمارين تفصيلي للتمرين في النادي حسب هدفك ومستواك.",
    buttonLabel: "اختاري جدول النادي",
  },
  HOME_SCHEDULE: {
    key: "HOME_SCHEDULE",
    title: "جدول المنزل",
    link: "https://basmafit.com/جدول-المنزل/p433554190",
    description: "جدول تمارين تفصيلي للتمرين في المنزل حسب هدفك ومستواك.",
    buttonLabel: "اختاري جدول المنزل",
  },
  FULL_PACKAGE: {
    key: "FULL_PACKAGE",
    title: "بكج التمارين الشامل",
    link: "https://basmafit.com/بكج-التمارين-الشامل/p479823947",
    price: "87 ريال",
    badge: "الأكثر مبيعا",
    description:
      "البكج يشمل جداول النادي والمنزل، وتقدرين تتمرنين في المكانين حسب ظروفك.",
    buttonLabel: "اختاري بكج التمارين الشامل",
  },
};
