"use client";

import { useCallback, useReducer, useState, useSyncExternalStore } from "react";
import {
  MAX_AGE,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MIN_AGE,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
  PACE_MAX_PERCENT,
  PACE_MIN_PERCENT,
  clamp,
} from "@/lib/onboarding/calculations";
import { INITIAL_STATE as NUTREE_INITIAL_STATE } from "@/lib/onboarding/state";
import { STEP_IDS, type StepId } from "./steps";
import {
  TRAINING_DAYS_OPTIONS,
  type TrainingDays,
  type TrainingLocation,
  type WorkoutOnboardingState,
} from "./types";

/**
 * Progress for the Basmafit workout onboarding.
 *
 * Scoped to sessionStorage under a versioned, Basmafit-specific key. That gives
 * both behaviours the product needs: a refresh (or an accidental back-swipe)
 * lands on the same step with every answer intact, while a genuinely new visit
 * — new tab, reopened link, returning tomorrow — starts at step 1 with nothing
 * restored, so a finished plan is never shown again on arrival.
 *
 * The key is distinct from the Nutree onboarding key and from the quiz keys, so
 * nothing here can collide with, or clear, another flow's data.
 */
export const WORKOUT_ONBOARDING_KEY = "basmafit.workout.onboarding.v1";

/** Older shapes this flow used to write, cleared on load so they can't be read. */
const LEGACY_KEYS = ["basmafit_quiz_answers", "basmafit_quiz_progress"];

export const INITIAL_STATE: WorkoutOnboardingState = {
  ...NUTREE_INITIAL_STATE,
  trainingLocation: null,
  trainingDays: null,
  /*
    This flow has no hydration question. The field stays on the object because
    the shared plan builder takes the whole Nutree answer set, but it is pinned
    to null so the daily water figure is always the recommended one — nothing
    in the flow can set it, and nothing displays it.
  */
  waterMl: null,
};

export type WorkoutAction =
  | { type: "patch"; patch: Partial<WorkoutOnboardingState> }
  | { type: "resetPlanEdits" };

function reducer(
  state: WorkoutOnboardingState,
  action: WorkoutAction
): WorkoutOnboardingState {
  switch (action.type) {
    case "patch":
      return normalise({ ...state, ...action.patch });
    case "resetPlanEdits":
      return {
        ...state,
        customCalories: null,
        customProteinG: null,
        customFatG: null,
        customCarbsG: null,
      };
    default:
      return state;
  }
}

/** Keeps every stored number inside the range its picker can actually reach. */
function normalise(state: WorkoutOnboardingState): WorkoutOnboardingState {
  return {
    ...state,
    age: clamp(Math.round(state.age), MIN_AGE, MAX_AGE),
    heightCm: clamp(Math.round(state.heightCm), MIN_HEIGHT_CM, MAX_HEIGHT_CM),
    weightKg: clamp(state.weightKg, MIN_WEIGHT_KG, MAX_WEIGHT_KG),
    targetWeightKg:
      state.targetWeightKg === null
        ? null
        : clamp(state.targetWeightKg, MIN_WEIGHT_KG, MAX_WEIGHT_KG),
    pacePercent: clamp(state.pacePercent, PACE_MIN_PERCENT, PACE_MAX_PERCENT),
    // No hydration screen here, so there is no user-set value to keep in range.
    waterMl: null,
  };
}

/* ------------------------------------------------------------------ */
/* Persistence                                                          */
/* ------------------------------------------------------------------ */

interface Persisted {
  version: number;
  stepId: StepId;
  state: WorkoutOnboardingState;
}

const VERSION = 1;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLocation(value: unknown): value is TrainingLocation {
  return value === "home" || value === "gym";
}

function isDays(value: unknown): value is TrainingDays {
  return TRAINING_DAYS_OPTIONS.includes(value as TrainingDays);
}

/**
 * Rebuilds a saved run, field by field, from whatever is on disk.
 *
 * Anything unrecognised falls back to its initial value rather than throwing,
 * so a save written by the older 8-step workout flow — or a truncated or
 * hand-edited one — can never crash the page. If the saved step id is not part
 * of the current 19-step order — a save left on the removed hydration screen,
 * for instance — the run simply restarts at step 1.
 */
export function migratePersisted(raw: unknown): { stepId: StepId; state: WorkoutOnboardingState } | null {
  if (!isRecord(raw)) return null;

  const savedState = isRecord(raw.state) ? raw.state : null;
  if (!savedState) return null;

  const merged: WorkoutOnboardingState = normalise({
    ...INITIAL_STATE,
    ...(savedState as Partial<WorkoutOnboardingState>),
    trainingLocation: isLocation(savedState.trainingLocation)
      ? savedState.trainingLocation
      : null,
    trainingDays: isDays(savedState.trainingDays) ? savedState.trainingDays : null,
  });

  const savedStep = raw.stepId;
  const stepId: StepId =
    typeof savedStep === "string" && (STEP_IDS as readonly string[]).includes(savedStep)
      ? (savedStep as StepId)
      : "welcome";

  return { stepId, state: merged };
}

function clearLegacy() {
  for (const key of LEGACY_KEYS) {
    try {
      window.localStorage.removeItem(key);
    } catch {
      // Private mode — nothing was written.
    }
  }
}

export function saveProgress(stepId: StepId, state: WorkoutOnboardingState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(
      WORKOUT_ONBOARDING_KEY,
      JSON.stringify({ version: VERSION, stepId, state } satisfies Persisted)
    );
  } catch {
    // Private mode / quota — progress just isn't restorable.
  }
}

/** Ends the run, so the next arrival is a clean one. */
export function clearWorkoutOnboarding() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(WORKOUT_ONBOARDING_KEY);
  } catch {
    // ignored
  }
}

/* ------------------------------------------------------------------ */
/* Boot                                                                 */
/* ------------------------------------------------------------------ */

export interface WorkoutBoot {
  token: "server" | "client";
  stepId: StepId;
  state: WorkoutOnboardingState;
}

const SERVER_BOOT: WorkoutBoot = {
  token: "server",
  stepId: "welcome",
  state: INITIAL_STATE,
};

let clientBoot: WorkoutBoot | undefined;

function getClientBoot(): WorkoutBoot {
  if (!clientBoot) {
    clearLegacy();

    let restored: { stepId: StepId; state: WorkoutOnboardingState } | null = null;
    try {
      const raw = window.sessionStorage.getItem(WORKOUT_ONBOARDING_KEY);
      restored = raw ? migratePersisted(JSON.parse(raw)) : null;
    } catch {
      restored = null;
    }

    // A save that can't be mapped is dropped rather than half-applied.
    if (!restored) clearWorkoutOnboarding();

    clientBoot = {
      token: "client",
      stepId: restored?.stepId ?? "welcome",
      state: restored?.state ?? INITIAL_STATE,
    };
  }
  return clientBoot;
}

function getServerBoot(): WorkoutBoot {
  return SERVER_BOOT;
}

function subscribe(): () => void {
  return () => {};
}

export function useWorkoutBoot(): WorkoutBoot {
  return useSyncExternalStore(subscribe, getClientBoot, getServerBoot);
}

export function useWorkoutSession(boot: WorkoutBoot) {
  const [state, dispatch] = useReducer(reducer, boot.state);
  const [stepId, setStepId] = useState<StepId>(boot.stepId);

  const patch = useCallback((next: Partial<WorkoutOnboardingState>) => {
    dispatch({ type: "patch", patch: next });
  }, []);

  const resetPlanEdits = useCallback(() => {
    dispatch({ type: "resetPlanEdits" });
  }, []);

  return { state, stepId, setStepId, patch, resetPlanEdits };
}
