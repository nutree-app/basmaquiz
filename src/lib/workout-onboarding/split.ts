import { EXERCISES, FOCUS_TITLE, SPLITS, SPLIT_NAME } from "@/lib/workout-plan";
import type { Goal } from "@/lib/onboarding/types";
import {
  TRAINING_LOCATION_LABEL,
  type TrainingDays,
  type TrainingLocation,
  type WorkoutOnboardingState,
} from "./types";

/**
 * Builds the weekly training split from the two workout answers.
 *
 * Reuses the exercise pools and day-splits the quiz result already ships, so
 * there is one vocabulary of movements in the project rather than two:
 *  - `trainingLocation` picks the pool. Home plans are bodyweight / band /
 *    light-dumbbell only; gym plans use barbell, cable and machine work.
 *  - `trainingDays` fixes the schedule length — the split array *is* that many
 *    entries, so a 3-day answer can never produce a 5-day week.
 */

/** Volume guidance, driven by the Nutree goal rather than the quiz's Arabic labels. */
const INTENSITY: Record<Goal, string> = {
  lose: "3 مجموعات × 12-15 تكرار، راحة 45 ثانية",
  gain: "4 مجموعات × 8-12 تكرار، راحة 90 ثانية",
  maintain: "3 مجموعات × 10-12 تكرار، راحة 60 ثانية",
};

const EQUIPMENT_NOTE: Record<TrainingLocation, string> = {
  gym: "التمارين مبنية على معدات النادي: بار، دمبل، كيبل وأجهزة.",
  home: "كل التمارين تنفذ في البيت بوزن الجسم أو بحبل مقاومة ودمبل خفيف.",
};

/** More movements per session as the week gets shorter and each day does more. */
function exercisesPerDay(days: TrainingDays): number {
  if (days <= 2) return 6;
  if (days <= 4) return 5;
  return 4;
}

export interface TrainingDay {
  day: number;
  title: string;
  exercises: string[];
}

export interface TrainingSplit {
  location: TrainingLocation;
  locationLabel: string;
  days: TrainingDays;
  splitName: string;
  intensity: string;
  schedule: TrainingDay[];
  equipmentNote: string;
}

/** Returns null until both workout answers exist, so callers can fall back. */
export function buildTrainingSplit(state: WorkoutOnboardingState): TrainingSplit | null {
  const { trainingLocation, trainingDays } = state;
  if (!trainingLocation || !trainingDays) return null;

  const pool = EXERCISES[trainingLocation];
  const perDay = exercisesPerDay(trainingDays);

  return {
    location: trainingLocation,
    locationLabel: TRAINING_LOCATION_LABEL[trainingLocation],
    days: trainingDays,
    splitName: SPLIT_NAME[trainingDays],
    intensity: INTENSITY[state.goal ?? "maintain"],
    schedule: SPLITS[trainingDays].map((focus, index) => ({
      day: index + 1,
      title: FOCUS_TITLE[focus],
      exercises: pool[focus].slice(0, perDay),
    })),
    equipmentNote: EQUIPMENT_NOTE[trainingLocation],
  };
}
