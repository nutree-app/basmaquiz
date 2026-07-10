export type Goal = "تنشيف وخسارة الدهون" | "تضخيم وزيادة الكتلة العضلية";

export type TrainingLocation = "النادي" | "المنزل";

export type Level = "مبتدئة" | "متوسطة" | "متقدمة";

export type TrainingDays = "3 أيام" | "4 أيام" | "5 أيام" | "6 أيام";

export type MainPreference =
  | "جدول تمارين واضح"
  | "نظام غذائي محسوب"
  | "تمارين ونظام غذائي معًا"
  | "متابعة وتحفيز مستمر";

export type RecommendedPlan =
  | "تنشيف نادي"
  | "تنشيف منزلي"
  | "تضخيم نادي"
  | "تضخيم منزلي";

export type PackageKey = "ONE_MONTH" | "TALTI_GHEIR" | "CHALLENGE_90";

export interface QuizAnswers {
  goal: Goal | "";
  trainingLocation: TrainingLocation | "";
  level: Level | "";
  trainingDays: TrainingDays | "";
  mainPreference: MainPreference | "";
}

export interface BasmaFitLead {
  goal: string;
  trainingLocation: string;
  level: string;
  trainingDays: string;
  mainPreference: string;
  recommendedPlan: string;
  selectedPackageKey: PackageKey | "";
  selectedPackageTitle: string;
  selectedPackagePrice: string;
  createdAt: string;
}

export const EMPTY_ANSWERS: QuizAnswers = {
  goal: "",
  trainingLocation: "",
  level: "",
  trainingDays: "",
  mainPreference: "",
};
