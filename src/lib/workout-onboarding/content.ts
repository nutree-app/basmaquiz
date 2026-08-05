import type { Choice } from "@/lib/onboarding/content";
import {
  TRAINING_DAYS_LABEL,
  TRAINING_DAYS_OPTIONS,
  type TrainingDays,
  type TrainingLocation,
} from "./types";

/* ------------------------------------------------------------------ */
/* Step 9 — training location                                           */
/* ------------------------------------------------------------------ */

export const trainingLocationStep = {
  title: "أين تفضلين التمرين؟",
  subtitle: "سنخصص التمارين حسب المكان والأدوات المتاحة لديك.",
} as const;

export const trainingLocationChoices: Choice<TrainingLocation>[] = [
  {
    value: "home",
    emoji: "🏠",
    title: "المنزل",
    caption: "أتمرن في البيت بأدوات بسيطة أو بدون أدوات",
  },
  {
    value: "gym",
    emoji: "🏋🏻‍♀️",
    title: "النادي الرياضي",
    caption: "أتمرن في الجيم مع المعدات الكاملة",
  },
];

/* ------------------------------------------------------------------ */
/* Step 10 — training days                                              */
/* ------------------------------------------------------------------ */

export const trainingDaysStep = {
  title: "كم يوم تتمرنين بالأسبوع؟",
  subtitle: "سنبني خطتك التدريبية بناء على جدولك.",
} as const;

const DAYS_CAPTION: Record<TrainingDays, string> = {
  2: "بداية خفيفة ومناسبة للانطلاق",
  3: "مثالي للمبتدئات",
  4: "توازن جيد بين النتيجة والوقت",
  5: "الخيار الأكثر شيوعا",
  6: "للرياضيات المتقدمات",
};

/**
 * Stored as a number but rendered through the shared Choice list, which keys on
 * strings — the flow converts back on selection.
 */
export const trainingDaysChoices: Choice<string>[] = TRAINING_DAYS_OPTIONS.map((days) => ({
  value: String(days),
  emoji: String(days),
  title: TRAINING_DAYS_LABEL[days],
  caption: DAYS_CAPTION[days],
}));

/* ------------------------------------------------------------------ */
/* Steps 17–19 — the automatic build screens                            */
/* ------------------------------------------------------------------ */

export const transitionSteps = {
  analyzing: {
    emoji: "🧠",
    title: "نحلل إجاباتك",
    subtitle: "نراجع هدفك ومستوى نشاطك وقياساتك لبناء الخطة الأنسب لك.",
  },
  building: {
    emoji: "🏋🏻‍♀️",
    title: "نبني جدولك التدريبي",
    subtitle: "نوزع تمارينك على أيام الأسبوع حسب مكان تمرينك وعدد أيامك.",
  },
  calculating: {
    emoji: "🔥",
    title: "نحسب تغذيتك",
    subtitle: "نضبط سعراتك والماكروز وهدف الماء على أساس بياناتك.",
  },
} as const;

/* ------------------------------------------------------------------ */
/* Step 20 — the Basmafit offer                                         */
/* ------------------------------------------------------------------ */

export const offerStep = {
  eyebrow: "خطتك جاهزة",
  title: "خطتك مع بسمة فت",
  subtitle: "جهزنا لك خطة تمرين وتغذية مبنية على إجاباتك، جاهزة تبدئين فيها اليوم.",
  planSummaryTitle: "خطتك المخصصة",
  caloriesUnit: "سعرة / يوم",
  trainingTitle: "تدريبك",
  locationLabel: "مكان التمرين",
  daysLabel: "أيام التمرين",
  splitLabel: "تقسيمة الأسبوع",
  includedTitle: "الخطة تشمل",
  features: [
    "جدول تمارين مقسم على أيام الأسبوع",
    "تمارين مناسبة لمكان تمرينك",
    "شرح التمارين بالفيديو",
    "نظام غذائي محسوب على سعراتك",
    "توزيع الماكروز حسب أسلوبك الغذائي",
    "هدف الماء اليومي",
    "متابعة شخصية مع الكوتش",
  ],
  cta: "ابدئي خطتك الآن",
  reassurance: "تنتقلين لصفحة المنتج في متجر بسمة فت لإتمام الطلب.",
} as const;
