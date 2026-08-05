/**
 * The nutrition math behind the onboarding. Pure functions only — no React,
 * no strings — so the numbers on every screen come from one place and stay
 * consistent with the Nutree app.
 *
 * The models below are the ones the app uses, verified against the reference
 * screenshots (74 kg → 69 kg, low-fat + high-protein, 0.43 %/week):
 *   calories 1470  ·  protein 133 g  ·  fat 33 g  ·  carbs 160 g
 *   pace 0.43 %/week → 110 days → "16 اسبوع" → Nov 23, 2026
 *   water 74 kg × 35 ml → 2600 ml
 */

import type {
  ActivityLevel,
  BmiCategory,
  DietStyle,
  Gender,
  Goal,
  OnboardingState,
  ProteinLevel,
} from "./types";

export type { BmiCategory };

/** Harris-Benedict style activity factors applied to BMR. */
export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very: 1.725,
};

/** Share of daily calories that comes from fat, per dietary style. */
export const FAT_CALORIE_RATIO: Record<DietStyle, number> = {
  balanced: 0.3,
  lowFat: 0.2,
  lowCarb: 0.4,
  keto: 0.7,
};

/** Grams of protein per kilogram of current body weight. */
export const PROTEIN_PER_KG: Record<ProteinLevel, number> = {
  low: 1.2,
  moderate: 1.5,
  high: 1.8,
};

/** Energy stored in one kilogram of body mass. */
export const KCAL_PER_KG = 7700;

/** Millilitres of water per kilogram of body weight, before the activity bonus. */
export const WATER_ML_PER_KG = 35;

const WATER_ACTIVITY_BONUS_ML: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 250,
  moderate: 500,
  very: 750,
};

/** Never prescribe less than this, whatever the deficit maths says. */
const CALORIE_FLOOR: Record<Gender, number> = {
  female: 1200,
  male: 1500,
};

export const PACE_MIN_PERCENT = 0.2;
export const PACE_MAX_PERCENT = 0.9;
export const PACE_DEFAULT_PERCENT = 0.43;

export const WATER_MIN_ML = 1000;
export const WATER_MAX_ML = 5000;
export const WATER_STEP_ML = 100;

export const MIN_WEIGHT_KG = 35;
export const MAX_WEIGHT_KG = 200;
export const MIN_HEIGHT_CM = 120;
export const MAX_HEIGHT_CM = 220;
export const MIN_AGE = 13;
export const MAX_AGE = 100;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/* ------------------------------------------------------------------ */
/* Body composition                                                     */
/* ------------------------------------------------------------------ */

export function calcBmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const metres = heightCm / 100;
  return weightKg / (metres * metres);
}

export function bmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

/** Mifflin-St Jeor — the app's basal metabolic rate model. */
export function calcBmr(
  gender: Gender,
  weightKg: number,
  heightCm: number,
  age: number
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
}

export function calcTdee(bmr: number, activity: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activity];
}

/* ------------------------------------------------------------------ */
/* Goal and pace                                                        */
/* ------------------------------------------------------------------ */

/** Which way the plan moves — derived from the numbers, not the stated goal. */
export function weightDirection(
  currentKg: number,
  targetKg: number
): "lose" | "gain" | "maintain" {
  const delta = targetKg - currentKg;
  if (Math.abs(delta) < 0.1) return "maintain";
  return delta < 0 ? "lose" : "gain";
}

/** Kilograms per week implied by a "% of body weight per week" pace. */
export function weeklyRateKg(pacePercent: number, currentKg: number): number {
  return (currentKg * pacePercent) / 100;
}

export type PaceBand = "slow" | "moderate" | "fast" | "veryFast";

export function paceBand(pacePercent: number): PaceBand {
  if (pacePercent < 0.35) return "slow";
  if (pacePercent <= 0.6) return "moderate";
  if (pacePercent <= 0.8) return "fast";
  return "veryFast";
}

export interface Timeline {
  /** Calendar days to reach the target weight; 0 when maintaining. */
  days: number;
  /** Rounded weeks, as shown on the motivation screen. */
  weeks: number;
  /** Target date, or null when there is nothing to reach. */
  targetDate: Date | null;
}

export function calcTimeline({
  currentKg,
  targetKg,
  pacePercent,
  startDate,
}: {
  currentKg: number;
  targetKg: number;
  pacePercent: number;
  startDate: Date;
}): Timeline {
  const deltaKg = Math.abs(targetKg - currentKg);
  const perWeek = weeklyRateKg(pacePercent, currentKg);
  if (deltaKg < 0.1 || perWeek <= 0) {
    return { days: 0, weeks: 0, targetDate: null };
  }

  const days = Math.max(1, Math.round((deltaKg / perWeek) * 7));
  const targetDate = new Date(startDate.getTime());
  targetDate.setDate(targetDate.getDate() + days);

  return { days, weeks: Math.max(1, Math.round(days / 7)), targetDate };
}

/* ------------------------------------------------------------------ */
/* Calories and macros                                                  */
/* ------------------------------------------------------------------ */

/**
 * Daily calorie target. The surplus/deficit is the weekly weight change
 * converted to energy and spread over seven days, then rounded to the nearest
 * 10 kcal the way the app presents it.
 *
 * Reference check — female, 25, 170 cm, 74 kg, sedentary, 0.43 %/week:
 * BMR 1516.5 → TDEE 1819.8 → deficit 350.0 → 1469.8 → 1470 kcal, matching
 * the app screen exactly.
 */
export function calcDailyCalories({
  tdee,
  gender,
  direction,
  weeklyKg,
}: {
  tdee: number;
  gender: Gender;
  direction: "lose" | "gain" | "maintain";
  weeklyKg: number;
}): number {
  const dailyDelta = (weeklyKg * KCAL_PER_KG) / 7;
  let raw = tdee;
  if (direction === "lose") raw = tdee - dailyDelta;
  if (direction === "gain") raw = tdee + dailyDelta;

  return Math.max(CALORIE_FLOOR[gender], Math.round(raw / 10) * 10);
}

export interface Macros {
  proteinG: number;
  fatG: number;
  carbsG: number;
}

/**
 * Protein is anchored to body weight, fat to a share of total calories, and
 * carbohydrate takes whatever energy is left over.
 */
export function calcMacros({
  calories,
  weightKg,
  dietStyle,
  proteinLevel,
}: {
  calories: number;
  weightKg: number;
  dietStyle: DietStyle;
  proteinLevel: ProteinLevel;
}): Macros {
  const proteinG = Math.round(weightKg * PROTEIN_PER_KG[proteinLevel]);
  const fatG = Math.round((calories * FAT_CALORIE_RATIO[dietStyle]) / 9);
  const carbsG = Math.max(
    0,
    Math.round((calories - proteinG * 4 - fatG * 9) / 4)
  );

  return { proteinG, fatG, carbsG };
}

export function macroCalories({ proteinG, fatG, carbsG }: Macros): number {
  return proteinG * 4 + fatG * 9 + carbsG * 4;
}

/* ------------------------------------------------------------------ */
/* Hydration                                                            */
/* ------------------------------------------------------------------ */

export function calcWaterMl(weightKg: number, activity: ActivityLevel): number {
  const raw = weightKg * WATER_ML_PER_KG + WATER_ACTIVITY_BONUS_ML[activity];
  const rounded = Math.round(raw / WATER_STEP_ML) * WATER_STEP_ML;
  return clamp(rounded, 1500, 4500);
}

/* ------------------------------------------------------------------ */
/* One derived plan for the whole flow                                  */
/* ------------------------------------------------------------------ */

export interface DerivedPlan {
  bmi: number;
  bmiCategory: BmiCategory;
  bmr: number;
  tdee: number;
  currentWeightKg: number;
  targetWeightKg: number;
  direction: "lose" | "gain" | "maintain";
  weeklyKg: number;
  monthlyKg: number;
  timeline: Timeline;
  /** Calories the maths recommends, before any manual edit. */
  recommendedCalories: number;
  recommendedMacros: Macros;
  /** What the user actually sees — the recommendation unless they edited it. */
  calories: number;
  macros: Macros;
  isCustomised: boolean;
  recommendedWaterMl: number;
  waterMl: number;
}

/** Sensible stand-ins so early screens can still show live numbers. */
const FALLBACK_GENDER: Gender = "female";
const FALLBACK_ACTIVITY: ActivityLevel = "sedentary";
const FALLBACK_DIET: DietStyle = "balanced";
const FALLBACK_PROTEIN: ProteinLevel = "moderate";

/**
 * Single source of truth for every number rendered in the flow. Steps read
 * from this rather than recomputing, so the calorie figure on the pace screen,
 * the plan screen, the motivation screen and the Pro offer can never disagree.
 */
export function buildPlan(state: OnboardingState, now: Date): DerivedPlan {
  const gender = state.gender ?? FALLBACK_GENDER;
  const activity = state.activity ?? FALLBACK_ACTIVITY;
  const dietStyle = state.dietStyle ?? FALLBACK_DIET;
  const proteinLevel = state.proteinLevel ?? FALLBACK_PROTEIN;

  const currentWeightKg = state.weightKg;
  const targetWeightKg = resolveTargetWeight(state);

  const bmi = calcBmi(currentWeightKg, state.heightCm);
  const bmr = calcBmr(gender, currentWeightKg, state.heightCm, state.age);
  const tdee = calcTdee(bmr, activity);

  const direction = weightDirection(currentWeightKg, targetWeightKg);
  const weeklyKg =
    direction === "maintain" ? 0 : weeklyRateKg(state.pacePercent, currentWeightKg);

  const timeline = calcTimeline({
    currentKg: currentWeightKg,
    targetKg: targetWeightKg,
    pacePercent: state.pacePercent,
    startDate: now,
  });

  const recommendedCalories = calcDailyCalories({
    tdee,
    gender,
    direction,
    weeklyKg,
  });
  const calories = state.customCalories ?? recommendedCalories;

  // Macros are derived from the calorie figure the user is actually looking
  // at, so nudging the calorie target re-splits the macros with it — while an
  // explicitly edited macro still wins over the recalculated one.
  const recommendedMacros = calcMacros({
    calories,
    weightKg: currentWeightKg,
    dietStyle,
    proteinLevel,
  });

  const macros: Macros = {
    proteinG: state.customProteinG ?? recommendedMacros.proteinG,
    fatG: state.customFatG ?? recommendedMacros.fatG,
    carbsG: state.customCarbsG ?? recommendedMacros.carbsG,
  };

  const isCustomised =
    state.customCalories !== null ||
    state.customProteinG !== null ||
    state.customFatG !== null ||
    state.customCarbsG !== null;

  const recommendedWaterMl = calcWaterMl(currentWeightKg, activity);

  return {
    bmi,
    bmiCategory: bmiCategory(bmi),
    bmr,
    tdee,
    currentWeightKg,
    targetWeightKg,
    direction,
    weeklyKg,
    monthlyKg: weeklyKg * (365 / 12 / 7),
    timeline,
    recommendedCalories,
    recommendedMacros,
    calories,
    macros,
    isCustomised,
    recommendedWaterMl,
    waterMl: state.waterMl ?? recommendedWaterMl,
  };
}

/**
 * Target weight before the user touches the ruler: the current weight, nudged
 * by a healthy default in the direction of the stated goal so the ruler opens
 * somewhere useful rather than at a dead stop.
 */
export function defaultTargetWeight(weightKg: number, goal: Goal | null): number {
  if (goal === "lose") return roundHalf(clamp(weightKg * 0.93, MIN_WEIGHT_KG, MAX_WEIGHT_KG));
  if (goal === "gain") return roundHalf(clamp(weightKg * 1.07, MIN_WEIGHT_KG, MAX_WEIGHT_KG));
  return roundHalf(weightKg);
}

export function resolveTargetWeight(state: OnboardingState): number {
  if (state.targetWeightKg !== null) return state.targetWeightKg;
  if (state.goal === "maintain") return state.weightKg;
  return defaultTargetWeight(state.weightKg, state.goal);
}

export function roundHalf(value: number): number {
  return Math.round(value * 2) / 2;
}
