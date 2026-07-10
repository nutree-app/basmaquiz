import { Goal, PackageKey, QuizAnswers, RecommendedPlan, TrainingLocation } from "./types";

export function getRecommendedPlan(
  goal: Goal | "",
  trainingLocation: TrainingLocation | ""
): RecommendedPlan {
  const isCutting = goal === "تنشيف وخسارة الدهون";
  const isClub = trainingLocation === "النادي";

  if (isCutting) return isClub ? "تنشيف نادي" : "تنشيف منزلي";
  return isClub ? "تضخيم نادي" : "تضخيم منزلي";
}

export function getRecommendedPackage(answers: QuizAnswers): PackageKey {
  if (answers.mainPreference === "متابعة وتحفيز مستمر") return "CHALLENGE_90";
  if (answers.trainingDays === "5 أيام" || answers.trainingDays === "6 أيام") {
    return "CHALLENGE_90";
  }
  if (answers.trainingDays === "3 أيام" && answers.level === "مبتدئة") {
    return "ONE_MONTH";
  }
  return "TALTI_GHEIR";
}
