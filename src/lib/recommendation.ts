import { type ProductKey, type QuizAnswers, TRAINING_DAYS_LABEL, type TrainingLocation } from "./types";

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
// 1) ٧ أيام تمرين → البكج الشامل
// 2) المحافظة على الوزن → طلتي غير
// 3) خسارة الوزن → باقة التنشيف
// 4) بناء العضلات → باقة التضخيم
//
// The first rule replaces the old `trainingPreference === "المنزل والنادي معًا"`
// trigger, which the redesigned location question no longer offers. Seven
// training days carries the same signal — the most committed trainee — so
// البكج الشامل stays reachable instead of becoming an orphaned product.
// Every goal-based path below is unchanged.
export function getRecommendedProduct(answers: QuizAnswers): ProductKey {
  if (answers.trainingDays === 7) {
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

function locationLabel(location: TrainingLocation | ""): string {
  if (location === "home") return "المنزل";
  return "النادي الرياضي";
}

export function buildResultExplanation(answers: QuizAnswers): string {
  const goalText = answers.goal || "هدفك";
  const locationText = locationLabel(answers.trainingLocation);
  const levelText = answers.level || "مستواك الحالي";
  const daysText = answers.trainingDays ? TRAINING_DAYS_LABEL[answers.trainingDays] : "";
  const daysClause = daysText ? `، وتمرينك ${daysText} في الأسبوع` : "";

  return `بناء على هدفك في ${goalText}، وتفضيلك التمرين في ${locationText}${daysClause}، ومستواك ${levelText}، جهزنا لك البرنامج الأنسب.`;
}
