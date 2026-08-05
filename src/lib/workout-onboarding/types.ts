import type { OnboardingState } from "@/lib/onboarding/types";

/** Where the user trains — drives the exercise vocabulary in the plan. */
export type TrainingLocation = "home" | "gym";

/** Training days per week. The generated split always has exactly this many days. */
export type TrainingDays = 2 | 3 | 4 | 5 | 6;

/**
 * The Nutree answer set plus the two workout questions.
 *
 * Extending rather than redefining means every Nutree screen and the whole
 * calculation engine accept this object unchanged.
 */
export interface WorkoutOnboardingState extends OnboardingState {
  trainingLocation: TrainingLocation | null;
  trainingDays: TrainingDays | null;
}

export const TRAINING_LOCATION_LABEL: Record<TrainingLocation, string> = {
  home: "المنزل",
  gym: "النادي الرياضي",
};

export const TRAINING_DAYS_OPTIONS: TrainingDays[] = [2, 3, 4, 5, 6];

export const TRAINING_DAYS_LABEL: Record<TrainingDays, string> = {
  2: "2 أيام",
  3: "3 أيام",
  4: "4 أيام",
  5: "5 أيام",
  6: "6 أيام",
};
