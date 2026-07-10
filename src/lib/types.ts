export type Goal =
  | "خسارة الدهون"
  | "زيادة الوزن / تضخيم"
  | "شد الجسم وتحسين الشكل"
  | "لياقة وصحة عامة";

export type WorkoutPlace = "في المنزل" | "في النادي";

export type Level = "مبتدئة" | "متوسطة" | "متقدمة";

export type TrainingDays = "3 أيام" | "4 أيام" | "5 أيام" | "6 أيام";

export type YesNo = "لا" | "نعم";

export type PregnancyStatus = "لا" | "حامل" | "مرضعة";

export type DietPreference =
  | "نظام عادي ومتوازن"
  | "نظام عالي بروتين"
  | "نظام نباتي"
  | "صيام متقطع"
  | "احتاج اقتراح من الكوتش";

export type BodyGoal =
  | "تنحيف وشد"
  | "تضخيم وبناء عضل"
  | "شد البطن والخصر"
  | "تحسين الجسم بشكل عام";

export type RecommendedPlan =
  | "تنشيف منزلي"
  | "تنشيف نادي"
  | "تضخيم منزلي"
  | "تضخيم نادي"
  | "تحسين الجسم واللياقة";

export type PackageKey = "ONE_MONTH" | "TALTI_GHEIR" | "CHALLENGE_90";

export interface QuizAnswers {
  name: string;
  phone: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  goal: Goal | "";
  workoutPlace: WorkoutPlace | "";
  level: Level | "";
  trainingDays: TrainingDays | "";
  injury: YesNo | "";
  injuryDetails: string;
  pregnancyStatus: PregnancyStatus | "";
  dietPreference: DietPreference | "";
  bodyGoal: BodyGoal | "";
}

export interface BasmaFitLead {
  name: string;
  phone: string;
  email: string;
  age: string;
  weight: string;
  height: string;
  goal: string;
  workoutPlace: string;
  level: string;
  trainingDays: string;
  injury: string;
  injuryDetails: string;
  pregnancyStatus: string;
  dietPreference: string;
  bodyGoal: string;
  recommendedPlan: string;
  selectedPackageTitle: string;
  selectedPackagePrice: string;
  createdAt: string;
}

export const EMPTY_ANSWERS: QuizAnswers = {
  name: "",
  phone: "",
  email: "",
  age: "",
  weight: "",
  height: "",
  goal: "",
  workoutPlace: "",
  level: "",
  trainingDays: "",
  injury: "",
  injuryDetails: "",
  pregnancyStatus: "",
  dietPreference: "",
  bodyGoal: "",
};
