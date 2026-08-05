/**
 * Shared vocabulary for the web onboarding. Every option key here mirrors a
 * choice shown in the Nutree app's onboarding so the calculation module can
 * stay a pure function of these values (no UI strings leak into the math).
 */

export type Gender = "male" | "female";

export type Goal = "lose" | "maintain" | "gain";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "very";

export type DietStyle = "balanced" | "lowFat" | "lowCarb" | "keto";

export type ProteinLevel = "low" | "moderate" | "high";

export type UnitSystem = "metric" | "imperial";

export type BmiCategory = "underweight" | "normal" | "overweight" | "obese";

export type EatingHabit =
  | "veryHealthy"
  | "mostlyHealthy"
  | "balanced"
  | "needsWork"
  | "unsure";

export type HealthMotivation =
  | "longevity"
  | "confidenceInClothes"
  | "energy"
  | "conditions"
  | "selfEsteem";

export type TrackingExperience =
  | "otherApps"
  | "penAndPaper"
  | "mental"
  | "never"
  | "triedAndStopped";

export type ReferralSource =
  | "appStore"
  | "friend"
  | "influencer"
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "other";

/** Everything the user picks during onboarding. Metric is the canonical storage unit. */
export interface OnboardingState {
  gender: Gender | null;
  age: number;
  units: UnitSystem;
  heightCm: number;
  weightKg: number;
  goal: Goal | null;
  activity: ActivityLevel | null;
  /** null until the user actually moves the target-weight ruler. */
  targetWeightKg: number | null;
  /** Percent of body weight to change per week — drives the pace slider. */
  pacePercent: number;
  dietStyle: DietStyle | null;
  proteinLevel: ProteinLevel | null;
  eatingHabit: EatingHabit | null;
  healthMotivation: HealthMotivation | null;
  trackingExperience: TrackingExperience | null;
  referral: ReferralSource | null;
  /** null = use the recommended value from calculations. */
  waterMl: number | null;
  /** null = use the calculated value; set only when the user edits the plan. */
  customCalories: number | null;
  customProteinG: number | null;
  customFatG: number | null;
  customCarbsG: number | null;
}
