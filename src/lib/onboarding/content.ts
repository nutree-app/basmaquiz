/**
 * Every Arabic string and option list in the onboarding, transcribed from the
 * app screens. Keeping copy out of the components means a screen is only
 * layout + behaviour, and a wording change never means touching JSX.
 */

import type {
  ActivityLevel,
  BmiCategory,
  DietStyle,
  EatingHabit,
  Gender,
  Goal,
  HealthMotivation,
  ProteinLevel,
  ReferralSource,
  TrackingExperience,
} from "./types";

/** A selectable card: emoji + bold title + optional grey caption. */
export interface Choice<T extends string> {
  value: T;
  emoji: string;
  title: string;
  caption?: string;
}

export const ui = {
  brand: "نيوتري",
  stepCounter: (current: number, total: number) => `الخطوة ${current} من ${total}`,
  continue: "متابعة",
  back: "رجوع",
  start: "ابدأ",
} as const;

/* ------------------------------------------------------------------ */
/* 1 · Welcome                                                          */
/* ------------------------------------------------------------------ */

export const welcome = {
  /** Two rows of five, rendered left-to-right exactly as in the app. */
  emojiRows: [
    ["🍏", "🍚", "🥩", "🍓", "🍉"],
    ["🥦", "🥬", "🥑", "🍍", "🍳"],
  ],
  title: "مرحباً بك في نيوتري!",
  subtitle: "تطبيقك للوصول لأهدافك الصحية",
  badge: "خطتك المخصصة في انتظارك!",
  cta: "ابدأ",
  footerPrompt: "لديك حساب بالفعل؟",
  footerAction: "حمّل التطبيق",
} as const;

/* ------------------------------------------------------------------ */
/* 2 · Personal information                                             */
/* ------------------------------------------------------------------ */

export const personal = {
  title: "المعلومات الشخصية",
  subtitle: "هذا يساعدنا في إنشاء خطتك الشخصية",
  ageLabel: "العمر",
} as const;

/** Male first so it lands on the right in the RTL row, as in the app. */
export const genderChoices: Choice<Gender>[] = [
  { value: "male", emoji: "👨", title: "ذكر" },
  { value: "female", emoji: "👩", title: "أنثى" },
];

/* ------------------------------------------------------------------ */
/* 3 · Height & weight                                                  */
/* ------------------------------------------------------------------ */

export const body = {
  title: "الطول والوزن",
  subtitle: "نستخدم هذه المعلومات لتخصيص خطتك",
  metric: "متري",
  imperial: "إمبراطوري",
  heightLabel: "الطول",
  weightLabel: "الوزن",
  bmiLabel: "مؤشر كتلة الجسم",
} as const;

export const bmiLabels: Record<BmiCategory, string> = {
  underweight: "نحيف",
  normal: "طبيعي",
  overweight: "زائد",
  obese: "سمنة",
};

/* ------------------------------------------------------------------ */
/* 4 · Goal                                                             */
/* ------------------------------------------------------------------ */

export const goalStep = {
  title: "ما هو هدفك الصحي؟",
  subtitle: "اختر هدفك الأساسي للحصول على توصيات شخصية",
} as const;

export const goalChoices: Choice<Goal>[] = [
  { value: "lose", emoji: "📉", title: "فقدان الوزن" },
  { value: "maintain", emoji: "⚖️", title: "المحافظة على الوزن" },
  { value: "gain", emoji: "📈", title: "زيادة الوزن" },
];

/* ------------------------------------------------------------------ */
/* 5 · Activity level                                                   */
/* ------------------------------------------------------------------ */

export const activityStep = {
  title: "مستوى النشاط",
  subtitle: "ما مدى نشاطك في حياتك اليومية؟",
  tip: "اختر الخيار الذي يصف أسبوعك العادي بشكل أفضل. هذا يؤثر على احتياجاتك اليومية من السعرات الحرارية.",
} as const;

export const activityChoices: Choice<ActivityLevel>[] = [
  {
    value: "sedentary",
    emoji: "🪑",
    title: "خامل",
    caption: "تمارين قليلة أو معدومة، عمل مكتبي",
  },
  {
    value: "light",
    emoji: "🚶",
    title: "نشط قليلاً",
    caption: "تمارين خفيفة 1-3 أيام في الأسبوع",
  },
  {
    value: "moderate",
    emoji: "🏃",
    title: "نشط معتدل",
    caption: "تمارين معتدلة 3-5 أيام في الأسبوع",
  },
  {
    value: "very",
    emoji: "💪",
    title: "نشط جداً",
    caption: "تمارين شاقة 6-7 أيام في الأسبوع",
  },
];

/* ------------------------------------------------------------------ */
/* 6 · Target weight                                                    */
/* ------------------------------------------------------------------ */

export const targetStep = {
  title: "ما هو وزنك المستهدف؟",
  same: "نفس الوزن الحالي",
  lose: (kg: string) => `أقل بـ ${kg} kg من وزنك الحالي`,
  gain: (kg: string) => `أكثر بـ ${kg} kg من وزنك الحالي`,
} as const;

/* ------------------------------------------------------------------ */
/* 7 · Goal speed                                                       */
/* ------------------------------------------------------------------ */

export const paceStep = {
  title: "سرعة وصولك للهدف؟",
  caloriesLabel: "السعرات المطلوبة",
  dateLabel: "تاريخ الوصول",
  weeklyLabel: "التغيير الأسبوعي",
  monthlyLabel: "التغيير الشهري",
  rate: (percent: string) => `${percent}% من وزن الجسم في الأسبوع`,
  maintainRate: "للمحافظة على وزنك الحالي",
  maintainDate: "مستمر",
  bands: {
    slow: "بطيء",
    moderate: "معتدل (موصى به)",
    fast: "سريع",
    veryFast: "سريع جداً",
  },
} as const;

/* ------------------------------------------------------------------ */
/* 8 · Diet style                                                       */
/* ------------------------------------------------------------------ */

export const dietStep = {
  title: "ما هو أسلوبك الغذائي؟",
  subtitle: "هذا يحدد نسبة الدهون إلى الكربوهيدرات. يمكنك تغييره لاحقاً.",
} as const;

export const dietChoices: Choice<DietStyle>[] = [
  { value: "balanced", emoji: "⚖️", title: "متوازن", caption: "نهج متوازن يناسب معظم الناس" },
  {
    value: "lowFat",
    emoji: "🥗",
    title: "قليل الدهون",
    caption: "كربوهيدرات أكثر للطاقة والأداء",
  },
  {
    value: "lowCarb",
    emoji: "🥩",
    title: "قليل الكربوهيدرات",
    caption: "كربوهيدرات أقل وشبع أكثر من الدهون",
  },
  {
    value: "keto",
    emoji: "🫒",
    title: "كيتو",
    caption: "دهون عالية جداً وكربوهيدرات منخفضة جداً",
  },
];

/* ------------------------------------------------------------------ */
/* 9 · Protein preference                                               */
/* ------------------------------------------------------------------ */

export const proteinStep = {
  title: "ما كمية البروتين التي تفضلها؟",
  subtitle: "البروتين الأعلى يساعد في الحفاظ على العضلات. اختر ما يناسبك.",
} as const;

export const proteinChoices: Choice<ProteinLevel>[] = [
  {
    value: "low",
    emoji: "🫛",
    title: "منخفض",
    caption: "مناسب للصحة العامة والوجبات الخفيفة",
  },
  {
    value: "moderate",
    emoji: "⚖️",
    title: "معتدل",
    caption: "توازن ممتاز بين دعم العضلات والمرونة",
  },
  {
    value: "high",
    emoji: "🔥",
    title: "عالي",
    caption: "أقصى حماية للعضلات أثناء تغيير الوزن",
  },
];

/* ------------------------------------------------------------------ */
/* 10 · Eating habits                                                   */
/* ------------------------------------------------------------------ */

export const habitStep = {
  title: "عادات الأكل لديك",
  subtitle: "هذا يساعدنا في تخصيص تجربتك.",
} as const;

export const habitChoices: Choice<EatingHabit>[] = [
  {
    value: "veryHealthy",
    emoji: "🥗",
    title: "صحي جداً",
    caption: "آكل في الغالب أطعمة كاملة وأطبخ في المنزل",
  },
  { value: "mostlyHealthy", emoji: "🍎", title: "صحي في الغالب", caption: "نظام غذائي متوازن" },
  { value: "balanced", emoji: "⚖️", title: "متوازن", caption: "مزيج من الأطعمة الصحية والمعالجة" },
  {
    value: "needsWork",
    emoji: "🍕",
    title: "يحتاج إلى تحسن",
    caption: "الكثير من الأطعمة المعالجة والطعام الجاهز",
  },
  { value: "unsure", emoji: "🤔", title: "لست متأكداً", caption: "ساعدني في معرفة أنماط الأكل لدي" },
];

/* ------------------------------------------------------------------ */
/* 11 · Why health matters                                              */
/* ------------------------------------------------------------------ */

export const motivationStep = {
  title: "لماذا الصحة مهمة لك",
  subtitle: "هذا يساعدنا في إنشاء خطة تحافظ على دافعيتك.",
} as const;

export const motivationChoices: Choice<HealthMotivation>[] = [
  {
    value: "longevity",
    emoji: "❤️",
    title: "العيش لفترة أطول وأكثر صحة",
    caption: "تقليل المخاطر الصحية والشعور بالراحة لسنوات",
  },
  {
    value: "confidenceInClothes",
    emoji: "👕",
    title: "الشعور بالثقة في الملابس",
    caption: "تبدو جيداً وتشعر بالراحة في أي زي",
  },
  {
    value: "energy",
    emoji: "⚡",
    title: "الحصول على المزيد من الطاقة",
    caption: "كن أكثر حضوراً ونشاطاً في الحياة اليومية",
  },
  {
    value: "conditions",
    emoji: "🩺",
    title: "تحسين الحالات الصحية",
    caption: "إدارة السكري وضغط الدم وغيرها",
  },
  {
    value: "selfEsteem",
    emoji: "💪",
    title: "الشعور بالجاذبية والثقة",
    caption: "تعزيز احترام الذات والثقة بالجسم",
  },
];

/* ------------------------------------------------------------------ */
/* 12 · Tracking experience                                             */
/* ------------------------------------------------------------------ */

export const trackingStep = {
  title: "تجربة التتبع الخاصة بك",
  subtitle: "كيف تتبع وجباتك حالياً؟",
} as const;

export const trackingChoices: Choice<TrackingExperience>[] = [
  {
    value: "otherApps",
    emoji: "📱",
    title: "تطبيقات تتبع أخرى",
    caption: "تطبيقات تتبع التغذية الشائعة",
  },
  { value: "penAndPaper", emoji: "📝", title: "قلم وورقة", caption: "ملاحظات تقليدية أو تطبيقات بسيطة" },
  { value: "mental", emoji: "🧠", title: "تتبع ذهني", caption: "أحاول أن أتذكر في رأسي" },
  {
    value: "never",
    emoji: "🆕",
    title: "لا أتتبع على الإطلاق",
    caption: "هذه ستكون أول مرة أتتبع فيها",
  },
  {
    value: "triedAndStopped",
    emoji: "🔄",
    title: "جربت لكن دائماً أتوقف",
    caption: "أريد بناء عادة مستدامة",
  },
];

/* ------------------------------------------------------------------ */
/* 13 · Referral source                                                 */
/* ------------------------------------------------------------------ */

export const referralStep = {
  title: "كيف عرفت عن نيوتري؟",
  subtitle: "هذا يساعدنا في فهم كيف يكتشف الناس تطبيقنا.",
} as const;

export const referralChoices: Choice<ReferralSource>[] = [
  { value: "appStore", emoji: "📲", title: "متجر التطبيقات", caption: "وجدته أثناء تصفح المتجر" },
  { value: "friend", emoji: "👥", title: "صديق أو عائلة", caption: "شخص ما أوصى لي بنيوتري" },
  { value: "influencer", emoji: "⭐", title: "مؤثر", caption: "أوصى به مؤثر" },
  { value: "instagram", emoji: "📸", title: "انستقرام", caption: "شاهدته على انستقرام" },
  { value: "tiktok", emoji: "🎵", title: "تيك توك", caption: "اكتشفته عبر تيك توك" },
  { value: "x", emoji: "✖️", title: "إكس (تويتر)", caption: "وجدته عبر إكس / تويتر" },
  { value: "youtube", emoji: "📺", title: "يوتيوب", caption: "شاهدته على يوتيوب" },
  { value: "other", emoji: "✨", title: "طريقة أخرى", caption: "اكتشفته بطريقة مختلفة" },
];

/* ------------------------------------------------------------------ */
/* 14 · Water goal                                                      */
/* ------------------------------------------------------------------ */

export const waterStep = {
  title: "نيوتري يساعدك تروي عطشك",
  subtitle: "حدد هدفك اليومي لشرب الماء وحافظ على مسارك.",
  benefits: [
    { emoji: "🔥", text: "يعزز حرق الدهون والتمثيل الغذائي", tone: "flame" },
    { emoji: "⚡", text: "يحافظ على نشاطك طوال اليوم", tone: "energy" },
    { emoji: "🚩", text: "يساعدك على تحقيق أهداف وزنك أسرع", tone: "goal" },
  ],
  unit: "مل / يوم",
  recommended: (ml: string) => `الموصى به لك: ${ml} مل`,
} as const;

/* ------------------------------------------------------------------ */
/* 15 · Personal plan                                                   */
/* ------------------------------------------------------------------ */

export const planStep = {
  title: "خطتك الشخصية",
  subtitle: "إليك خطة التغذية المخصصة لك",
  caloriesLabel: "هدف السعرات الحرارية اليومية",
  proteinLabel: "البروتين",
  fatLabel: "الدهون",
  carbsLabel: "الكارب",
  customBadge: "مخصص لك",
  recommendedBadge: "موصى به",
  reset: "إعادة تعيين إلى القيم الموصى بها",
  footnote: "بناءً على معدل الأيض الأساسي والاستهلاك اليومي. قابل للتعديل في أي وقت",
  editHint: "عدّل الأرقام بما يناسبك",
} as const;

/* ------------------------------------------------------------------ */
/* 16 · Motivation summary                                              */
/* ------------------------------------------------------------------ */

export const summaryStep = {
  title: "الالتزام والاستمرارية هي السر",
  subtitle: "جسمك المثالي أقرب من ما تتخيل!",
  durationLabel: "المدة",
  durationValue: (weeks: number) => `${weeks} اسبوع`,
  durationOngoing: "مستمر",
  dailyLabel: "هدفك اليومي",
  resultLabel: "النتيجة",
  tip: "الخطوات اليومية الصغيرة تؤدي إلى نتائج كبيرة. يمكنك فعلها!",
} as const;

/* ------------------------------------------------------------------ */
/* 17 · Nutree Pro offer                                                */
/* ------------------------------------------------------------------ */

export const offerStep = {
  eyebrow: "خطتك جاهزة",
  title: "نيوتري برو",
  subtitle: "خطتك الغذائية الشخصية جاهزة. أكمل رحلتك مع نيوتري برو.",
  planSummaryTitle: "خطتك المخصصة",
  caloriesUnit: "سعرة / يوم",
  includedTitle: "كل هذا مشمول",
  features: [
    "تتبع السعرات بالذكاء الاصطناعي من صور الطعام",
    "تسجيل الوجبات بالصوت",
    "تسجيل الوجبات بالكتابة",
    "ماسح الباركود",
    "تحليل ذكاء اصطناعي بلا حدود",
    "أهداف سعرات مخصصة لك",
    "ماكروز مخصصة لك",
    "تتبع شرب الماء",
    "تتبع الوزن",
    "تتبع التقدم",
    "سجل الوجبات",
    "الوجبات المفضلة",
    "توصيات تغذية ذكية",
  ],
  highlight: "وصول كامل لمدة سنة",
  currency: "ريال",
  perYear: "لمدة سنة كاملة",
  saveLabel: "وفّر",
  cta: "ابدأ رحلتك مع نيوتري برو",
  reassurance: "الدفع يتم عبر متجر بسمة فت — تصلك رسالة بكود التفعيل بعد الشراء مباشرة.",
} as const;
