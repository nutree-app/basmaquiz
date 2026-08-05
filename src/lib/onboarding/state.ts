/**
 * Onboarding state: one reducer, held in memory for a single visit.
 *
 * Nothing is persisted. Every entry to the flow clears the key this onboarding
 * used to write and starts again at step 1, so a returning visitor can never
 * land on an old answer set or a previously generated plan.
 *
 * Answers are stored canonically (metric, no derived values) — everything the
 * screens display comes from buildPlan() in calculations.ts, so there is a
 * single place where a number can be wrong.
 */

import { useCallback, useReducer, useState, useSyncExternalStore } from "react";
import {
  MAX_AGE,
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MIN_AGE,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
  PACE_DEFAULT_PERCENT,
  PACE_MAX_PERCENT,
  PACE_MIN_PERCENT,
  WATER_MAX_ML,
  WATER_MIN_ML,
  clamp,
} from "./calculations";
import { ONBOARDING_STORAGE_KEY } from "./config";
import type { OnboardingState } from "./types";

export const INITIAL_STATE: OnboardingState = {
  gender: null,
  age: 25,
  units: "metric",
  heightCm: 170,
  weightKg: 70,
  goal: null,
  activity: null,
  targetWeightKg: null,
  pacePercent: PACE_DEFAULT_PERCENT,
  dietStyle: null,
  proteinLevel: null,
  eatingHabit: null,
  healthMotivation: null,
  trackingExperience: null,
  referral: null,
  waterMl: null,
  customCalories: null,
  customProteinG: null,
  customFatG: null,
  customCarbsG: null,
};

export type OnboardingAction =
  | { type: "patch"; patch: Partial<OnboardingState> }
  | { type: "resetPlanEdits" }
  | { type: "reset" };

function reducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
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
    case "reset":
      return INITIAL_STATE;
    default:
      return state;
  }
}

/** Keeps every stored number inside the range its picker can actually reach. */
function normalise(state: OnboardingState): OnboardingState {
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
    waterMl: state.waterMl === null ? null : clamp(state.waterMl, WATER_MIN_ML, WATER_MAX_ML),
  };
}

/**
 * Wipes this site's saved run so every entry to the flow is a new session.
 *
 * Deliberately narrow: it removes only ONBOARDING_STORAGE_KEY — the key this
 * flow owns — from both local and session storage, and touches nothing else the
 * site keeps (quiz drafts, purchase leads, language cookies, analytics).
 */
export function resetOnboardingState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    window.sessionStorage.removeItem(ONBOARDING_STORAGE_KEY);
  } catch {
    // Private mode — nothing was ever written.
  }
}

/**
 * Where a session starts. `token` flips from "server" to "client" exactly once,
 * when browser-only APIs become readable.
 */
export interface OnboardingBoot {
  token: "server" | "client";
  state: OnboardingState;
  stepIndex: number;
}

const SERVER_BOOT: OnboardingBoot = {
  token: "server",
  state: INITIAL_STATE,
  stepIndex: 0,
};

/** Cached so useSyncExternalStore sees a stable snapshot across renders. */
let clientBoot: OnboardingBoot | undefined;

function getClientBoot(): OnboardingBoot {
  if (!clientBoot) {
    // Opening the flow always starts a brand-new run: clear whatever a previous
    // session left behind, then begin at step 1 with empty answers.
    //
    // Nothing is ever read back, so there is no path by which a finished result
    // could reach the screen — not even for a single frame before step 1.
    resetOnboardingState();
    clientBoot = { token: "client", state: INITIAL_STATE, stepIndex: 0 };
  }
  return clientBoot;
}

function getServerBoot(): OnboardingBoot {
  return SERVER_BOOT;
}

/** Nothing changes after the first client read, so there is no work here. */
function subscribe(): () => void {
  return () => {};
}

/**
 * Resolves the starting point without a hydration mismatch.
 *
 * Server and hydrating client both see SERVER_BOOT, so the markup agrees; React
 * then swaps in the client snapshot — which is the same fresh state, with the
 * previous run cleared as a side effect — and re-renders on its own.
 */
export function useOnboardingBoot(): OnboardingBoot {
  return useSyncExternalStore(subscribe, getClientBoot, getServerBoot);
}

/**
 * Holds the answers for one run of the flow.
 *
 * State lives in memory for the lifetime of this page and nowhere else: moving
 * back and forward keeps every answer, and the finished plan stays on screen
 * for as long as the user is on it — but a reload, a new tab or a later visit
 * all begin again at step 1.
 */
export function useOnboardingSession(boot: OnboardingBoot) {
  const [state, dispatch] = useReducer(reducer, boot.state);
  const [stepIndex, setStepIndex] = useState(boot.stepIndex);

  const patch = useCallback((next: Partial<OnboardingState>) => {
    dispatch({ type: "patch", patch: next });
  }, []);

  const resetPlanEdits = useCallback(() => {
    dispatch({ type: "resetPlanEdits" });
  }, []);

  return { state, stepIndex, setStepIndex, patch, resetPlanEdits };
}
