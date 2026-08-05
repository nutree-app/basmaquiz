export type Goal =
  | "خسارة الوزن"
  | "بناء العضلات"
  | "المحافظة على الوزن"
  | "تحسين اللياقة";

/**
 * Where the user trains. Replaces the old free-text TrainingPreference, whose
 * third option ("المنزل والنادي معًا") the redesigned question no longer
 * offers — see migrateAnswers() in storage.ts for how saved answers are mapped.
 */
export type TrainingLocation = "gym" | "home";

/** Training days per week. The generated schedule always has exactly this many days. */
export type TrainingDays = 2 | 3 | 4 | 5 | 6;

export type Level = "مبتدئة" | "متوسطة" | "متقدمة";

export type Gender = "أنثى" | "ذكر";

export type ProgramType = "نظام غذائي + جدول تمارين + متابعة" | "جدول تمارين + متابعة";

export type ProductKey =
  | "CUTTING_PACKAGE"
  | "BULKING_PACKAGE"
  | "TALATI_GHEIR"
  | "GYM_TABLE"
  | "HOME_TABLE"
  | "FULL_PACKAGE";

export interface QuizAnswers {
  goal: Goal | "";
  trainingLocation: TrainingLocation | "";
  level: Level | "";
  trainingDays: TrainingDays | 0;
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
  trainingLocation: "",
  level: "",
  trainingDays: 0,
  gender: "",
  age: DEFAULT_AGE,
  height: DEFAULT_HEIGHT,
  weight: DEFAULT_WEIGHT,
  programType: "",
};

/** Arabic label for a training location — used in the lead, the result copy and analytics. */
export const TRAINING_LOCATION_LABEL: Record<TrainingLocation, string> = {
  gym: "النادي الرياضي",
  home: "المنزل",
};

/** Arabic label for a training-day count, e.g. 3 -> "٣ أيام". */
export const TRAINING_DAYS_LABEL: Record<TrainingDays, string> = {
  2: "2 أيام",
  3: "3 أيام",
  4: "4 أيام",
  5: "5 أيام",
  6: "6 أيام",
};

export const TRAINING_DAYS_OPTIONS: TrainingDays[] = [2, 3, 4, 5, 6];
