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

// ترتيب الأولوية (لا تغيّري الترتيب):
// 1) المنزل والنادي معًا → البكج الشامل فقط
// 2) المحافظة على الوزن → طلتي غير
// 3) خسارة الوزن → باقة التنشيف
// 4) بناء العضلات → باقة التضخيم
export function getRecommendedProduct(answers: QuizAnswers): ProductKey {
  if (answers.trainingPreference === "المنزل والنادي معًا") {
    return "FULL_PACKAGE";
  }
  if (answers.goal === "المحافظة على الوزن") {
    return "TALATI_GHEIR";
  }
  if (answers.goal === "خسارة الوزن") {
    return "CUTTING_PACKAGE";
  }
  if (answers.goal === "بناء العضلات") {
    return "BULKING_PACKAGE";
  }
  return "CUTTING_PACKAGE";
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
