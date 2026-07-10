export type Goal =
  | "خسارة الوزن"
  | "بناء العضلات"
  | "المحافظة على الوزن"
  | "تحسين اللياقة";

export type TrainingPreference = "النادي" | "المنزل" | "المنزل والنادي معًا";

export type Level = "مبتدئة" | "متوسطة" | "متقدمة";

export type WeeklyDays = "2 أيام" | "3 أيام" | "4 أيام" | "5 أيام";

export type Gender = "أنثى" | "ذكر";

export type ProgramType = "نظام غذائي + جدول تمارين + متابعة" | "جداول تمارين فقط";

export type ProductKey =
  | "CUTTING_PACKAGE"
  | "TALATI_GHEIR"
  | "GYM_TABLE"
  | "HOME_TABLE"
  | "FULL_PACKAGE";

export interface QuizAnswers {
  goal: Goal | "";
  trainingPreference: TrainingPreference | "";
  level: Level | "";
  weeklyDays: WeeklyDays | "";
  gender: Gender | "";
  age: number;
  height: number;
  weight: number;
  programType: ProgramType | "";
}

export interface BasmaFitLead {
  goal: string;
  trainingPreference: string;
  level: string;
  weeklyDays: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
  programType: string;
  recommendedPlan: string;
  selectedProductKey: ProductKey | "";
  selectedProductTitle: string;
  selectedProductPrice: string;
  createdAt: string;
}

export const DEFAULT_AGE = 25;
export const DEFAULT_HEIGHT = 160;
export const DEFAULT_WEIGHT = 60;

export const EMPTY_ANSWERS: QuizAnswers = {
  goal: "",
  trainingPreference: "",
  level: "",
  weeklyDays: "",
  gender: "",
  age: DEFAULT_AGE,
  height: DEFAULT_HEIGHT,
  weight: DEFAULT_WEIGHT,
  programType: "",
};
