import { PackageKey } from "./types";

export interface PricingPackage {
  key: PackageKey;
  title: string;
  price: string;
  duration: string;
  description: string;
  features: string[];
  buttonLabel: string;
}

// مرتبة من الأبسط والأقل سعرًا إلى الأشمل والأعلى سعرًا
export const PRICING_PACKAGES: PricingPackage[] = [
  {
    key: "ONE_MONTH",
    title: "باقة الشهر",
    price: "59 ريال",
    duration: "شهر واحد",
    description: "مناسبة للتجربة والبداية بخطة واضحة.",
    features: [
      "خطة تمرين حسب هدفك",
      "نظام غذائي مناسب",
      "متابعة البداية والتوجيه",
    ],
    buttonLabel: "اختاري باقة الشهر",
  },
  {
    key: "TALTI_GHEIR",
    title: "طلتي غير",
    price: "87 ريال",
    duration: "شهرين",
    description: "الخيار الأفضل للي تبغى وقت كافي تشوف فرق واضح.",
    features: [
      "خطة تمرين حسب هدفك",
      "نظام غذائي مناسب",
      "متابعة وتوجيه أفضل",
      "مدة أطول لنتائج أوضح",
    ],
    buttonLabel: "اختاري طلتي غير",
  },
  {
    key: "CHALLENGE_90",
    title: "تحدي ٩٠ يوم",
    price: "149 ريال",
    duration: "90 يوم",
    description: "للي تبغى تلتزم وتحقق تغيير واضح خلال 3 شهور.",
    features: [
      "خطة تمرين 90 يوم",
      "نظام غذائي مناسب",
      "متابعة وتوجيه",
      "مناسب للالتزام والنتائج الكبيرة",
    ],
    buttonLabel: "اختاري تحدي ٩٠ يوم",
  },
];
