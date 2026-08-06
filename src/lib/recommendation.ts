import { type ProductKey, type QuizAnswers, type TrainingPreference } from "./types";

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  if (!heightM || !weightKg) return 0;
  const bmi = weightKg / (heightM * heightM);
  return Number.isFinite(bmi) ? bmi : 0;
}

export function getBmiCategory(bmi: number): string {
  if (!bmi || bmi <= 0 || !Number.isFinite(bmi)) return "";
  if (bmi < 18.5) return "نقص في الوزن";
  if (bmi < 25) return "وزن طبيعي";
  if (bmi < 30) return "وزن زائد";
  return "سمنة";
}

const TABLES_ONLY: string = "جدول تمارين فقط، بدون متابعة وبدون نظام غذائي";
const FULL_PROGRAM: string = "نظام غذائي + جدول تمارين + متابعة";

// من اختارت "جدول تمارين فقط" ما تحتاج متابعة ولا نظام غذائي، فالترشيح يصير جدول
// أو جدولين حسب مكان التمرين فقط
function wantsTablesOnly(answers: QuizAnswers): boolean {
  return answers.programType === TABLES_ONLY;
}

// الهدفان التاليان لهما منتج مخصص يغني عن عرض أي بديل
const GOAL_PRODUCT: Partial<Record<string, ProductKey>> = {
  "خسارة الوزن": "CUTTING_PACKAGE",
  "بناء العضلات": "BULKING_PACKAGE",
};

const GOAL_EXPLANATION: Partial<Record<string, string>> = {
  "خسارة الوزن": "برنامج التنشيف هو البرنامج الأنسب لك",
  "بناء العضلات": "برنامج التضخيم هو البرنامج الأنسب لك",
};

function goalProduct(answers: QuizAnswers): ProductKey | null {
  return answers.goal ? GOAL_PRODUCT[answers.goal] ?? null : null;
}

function tablesForPreference(preference: TrainingPreference | ""): ProductKey[] {
  if (preference === "المنزل") return ["HOME_TABLE"];
  if (preference === "المنزل والنادي معًا") return ["HOME_TABLE", "GYM_TABLE"];
  return ["GYM_TABLE"];
}

// ترتيب الأولوية (لا تغيّري الترتيب):
// 1) جدول تمارين فقط → الجدول/الجداول حسب مكان التمرين
// 2) هدف له منتج مخصص → باقة التنشيف أو التضخيم
// 3) نظام غذائي + جدول + متابعة → طلتي غير
// 4) غير ذلك → التضخيم لبناء العضلات، وإلا التنشيف
export function getRecommendedProducts(answers: QuizAnswers): ProductKey[] {
  if (wantsTablesOnly(answers)) {
    return tablesForPreference(answers.trainingPreference);
  }

  const exclusive = goalProduct(answers);
  if (exclusive) return [exclusive];

  if (answers.programType === FULL_PROGRAM) return ["TALATI_GHEIR"];

  return [answers.goal === "بناء العضلات" ? "BULKING_PACKAGE" : "CUTTING_PACKAGE"];
}

export function getPrimaryRecommendation(answers: QuizAnswers): ProductKey {
  return getRecommendedProducts(answers)[0];
}

// عندما يكون الترشيح حصريًا لا نعرض قسم "أو جدول تمارين بدون متابعة" في صفحة النتيجة
export function hasExclusiveRecommendation(answers: QuizAnswers): boolean {
  return wantsTablesOnly(answers) || goalProduct(answers) !== null;
}

export function buildResultTitle(): string {
  return "الخطة الأنسب لك جاهزة";
}

function locationLabel(pref: TrainingPreference | ""): string {
  if (pref === "المنزل") return "المنزل";
  if (pref === "المنزل والنادي معًا") return "المنزل والنادي معًا";
  return "النادي";
}

export function buildResultExplanation(answers: QuizAnswers): string {
  if (wantsTablesOnly(answers)) {
    if (answers.trainingPreference === "المنزل") {
      return "جدول تمارين المنزل هو الخيار الانسب لك";
    }
    if (answers.trainingPreference === "المنزل والنادي معًا") {
      return "الجداول الانسب لاختياراتك";
    }
    return "جدول تمارين النادي هو الخيار الانسب لك";
  }

  const goalExplanation = answers.goal ? GOAL_EXPLANATION[answers.goal] : undefined;
  if (goalExplanation) return goalExplanation;

  const goalText = answers.goal || "هدفك";
  const locationText = locationLabel(answers.trainingPreference);
  const levelText = answers.level || "مستواك الحالي";

  return `بناء على هدفك في ${goalText}، وتفضيلك التمرين في ${locationText}، ومستواك ${levelText}، جهزنا لك البرنامج الأنسب.`;
}
