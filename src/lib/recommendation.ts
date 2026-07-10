import { Goal, MainObstacle, ProductKey, QuizAnswers, TrainingLocation } from "./types";

export function getRecommendedPlanLabel(
  goal: Goal | "",
  trainingLocation: TrainingLocation | ""
): string {
  const goalLabel = goal === "تضخيم وزيادة الكتلة العضلية" ? "تضخيم" : "تنشيف";

  if (trainingLocation === "النادي") return `${goalLabel} نادي`;
  if (trainingLocation === "المنزل") return `${goalLabel} منزلي`;
  if (trainingLocation === "النادي والمنزل") return `${goalLabel} (نادي ومنزل)`;
  return goalLabel;
}

export function getRecommendedProducts(answers: QuizAnswers): ProductKey[] {
  if (answers.programType === "نظام غذائي + جداول تمارين + متابعة") {
    const regularProgram: ProductKey =
      answers.goal === "تضخيم وزيادة الكتلة العضلية" ? "BULKING_PROGRAM" : "CUTTING_PROGRAM";
    return [regularProgram, "TALTI_GHEIR"];
  }

  if (answers.trainingLocation === "النادي") return ["GYM_SCHEDULE", "FULL_PACKAGE"];
  if (answers.trainingLocation === "المنزل") return ["HOME_SCHEDULE", "FULL_PACKAGE"];
  return ["FULL_PACKAGE"];
}

export function buildResultSummary(answers: QuizAnswers): string {
  const goalText =
    answers.goal === "تضخيم وزيادة الكتلة العضلية" ? "التضخيم" : "التنشيف";
  const locationText = answers.trainingLocation || "مكان تمرينك";

  const supportPhrase =
    answers.programType === "جداول تمارين فقط"
      ? "ورغبتك في جداول تمارين فقط"
      : "واحتياجك لنظام غذائي ومتابعة";

  return `بناء على هدفك في ${goalText}، وتمرينك في ${locationText}، ${supportPhrase}، هذا هو البرنامج الأنسب لك.`;
}

const OBSTACLE_NOTES: Record<MainObstacle, string> = {
  "ما أعرف وش التمارين المناسبة": "خطتك بتوضح لك بالضبط أي تمارين تسوين خطوة بخطوة.",
  "ما أعرف كيف أرتب أكلي": "برنامجك بيرتب لك نظامك الغذائي بطريقة بسيطة وواضحة.",
  "أبدأ وأوقف بسرعة": "خطتك مبنية على خطوات تدريجية تساعدك تستمرين بدون ملل.",
  "أحتاج متابعة وتحفيز": "بتحصلين على متابعة وتوجيه مستمر يخليك على المسار الصحيح.",
  "أحتاج خطة واضحة ومتكاملة": "خطتك متكاملة وواضحة من أول يوم لين ما توصلين هدفك.",
};

export function getObstacleNote(mainObstacle: MainObstacle | ""): string | null {
  if (!mainObstacle) return null;
  return OBSTACLE_NOTES[mainObstacle];
}

export function getWeightGoalNote(currentWeight: number, targetWeight: number): string | null {
  const diff = targetWeight - currentWeight;
  if (diff === 0) return null;
  const verb = diff < 0 ? "تخسرين" : "تكسبين";
  return `هدفك أنك ${verb} حوالي ${Math.abs(diff)} كجم من وزنك الحالي.`;
}
