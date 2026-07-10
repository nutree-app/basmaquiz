export type Goal = "تنشيف وخسارة الدهون" | "تضخيم وزيادة الكتلة العضلية";

export type TrainingLocation = "النادي" | "المنزل" | "النادي والمنزل";

export type Level = "مبتدئة" | "متوسطة" | "متقدمة";

export type TrainingDays = "يومين" | "3 أيام" | "4 أيام" | "5 أيام أو أكثر";

export type MainObstacle =
  | "ما أعرف وش التمارين المناسبة"
  | "ما أعرف كيف أرتب أكلي"
  | "أبدأ وأوقف بسرعة"
  | "أحتاج متابعة وتحفيز"
  | "أحتاج خطة واضحة ومتكاملة";

export type ProgramType = "نظام غذائي + جداول تمارين + متابعة" | "جداول تمارين فقط";

export type AgeRange = "18-24" | "25-31" | "32-38" | "39-45" | "46+";

export type ProductKey =
  | "CUTTING_PROGRAM"
  | "BULKING_PROGRAM"
  | "TALTI_GHEIR"
  | "GYM_SCHEDULE"
  | "HOME_SCHEDULE"
  | "FULL_PACKAGE";

export interface QuizAnswers {
  goal: Goal | "";
  trainingLocation: TrainingLocation | "";
  level: Level | "";
  trainingDays: TrainingDays | "";
  mainObstacle: MainObstacle | "";
  programType: ProgramType | "";
  ageRange: AgeRange | "";
  currentWeight: number;
  targetWeight: number;
}

export interface BasmaFitLead {
  goal: string;
  trainingLocation: string;
  level: string;
  trainingDays: string;
  mainObstacle: string;
  programType: string;
  ageRange: string;
  currentWeight: number;
  targetWeight: number;
  recommendedPlan: string;
  selectedProductKey: ProductKey | "";
  selectedProductTitle: string;
  selectedProductPrice: string;
  createdAt: string;
}

export const DEFAULT_CURRENT_WEIGHT = 70;
export const DEFAULT_TARGET_WEIGHT = 65;

export const EMPTY_ANSWERS: QuizAnswers = {
  goal: "",
  trainingLocation: "",
  level: "",
  trainingDays: "",
  mainObstacle: "",
  programType: "",
  ageRange: "",
  currentWeight: DEFAULT_CURRENT_WEIGHT,
  targetWeight: DEFAULT_TARGET_WEIGHT,
};
