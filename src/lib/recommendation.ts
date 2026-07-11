import { ProductKey, QuizAnswers, TrainingPreference } from "./types";

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

export interface ComparisonPlan {
  basic: ProductKey;
  upsell: ProductKey;
}

function goalPackage(answers: QuizAnswers): ProductKey {
  return answers.goal === "بناء العضلات" ? "BULKING_PACKAGE" : "CUTTING_PACKAGE";
}

export function getComparisonPlan(answers: QuizAnswers): ComparisonPlan {
  if (answers.programType === "نظام غذائي + جدول تمارين + متابعة") {
    return { basic: goalPackage(answers), upsell: "TALATI_GHEIR" };
  }

  if (answers.trainingPreference === "النادي") {
    return { basic: "GYM_TABLE", upsell: goalPackage(answers) };
  }
  if (answers.trainingPreference === "المنزل") {
    return { basic: "HOME_TABLE", upsell: goalPackage(answers) };
  }

  // المنزل والنادي معًا: تمرين واحد كخيار بسيط + البكج الشامل كخيار أعلى قيمة
  return { basic: "HOME_TABLE", upsell: "FULL_PACKAGE" };
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
  const goalText = answers.goal || "هدفك";
  const locationText = locationLabel(answers.trainingPreference);
  const levelText = answers.level || "مستواك الحالي";

  return `بناء على هدفك في ${goalText}، وتفضيلك التمرين في ${locationText}، ومستواك ${levelText}، جهزنا لك البرنامج الأنسب.`;
}
