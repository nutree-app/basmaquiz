/**
 * Onboarding state: one reducer, one localStorage mirror.
 *
 * Answers are stored canonically (metric, no derived values) — everything the
 * screens display comes from buildPlan() in calculations.ts, so there is a
 * single place where a number can be wrong.
 */

import { useCallback, useEffect, useReducer, useState, useSyncExternalStore } from "react";
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
import { STEP_IDS } from "./steps";
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

interface PersistedShape {
  state: OnboardingState;
  stepIndex: number;
}

function readPersisted(): PersistedShape | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<PersistedShape>;
    if (!parsed || typeof parsed !== "object" || !parsed.state) return null;
    return {
      state: normalise({ ...INITIAL_STATE, ...parsed.state }),
      stepIndex: typeof parsed.stepIndex === "number" ? parsed.stepIndex : 0,
    };
  } catch {
    return null;
  }
}

/** Reads ?step=<id|index>, so a screen can be linked to directly. */
function readRequestedStep(): number | null {
  const requested = new URLSearchParams(window.location.search).get("step");
  if (!requested) return null;

  const byId = STEP_IDS.indexOf(requested as (typeof STEP_IDS)[number]);
  const index = byId >= 0 ? byId : Number(requested);
  return Number.isInteger(index) && index >= 0 && index < STEP_IDS.length ? index : null;
}

/**
 * Where a session starts. `token` is the only field the flow compares: it
 * flips from "server" to "client" exactly once, when the browser-only sources
 * (localStorage, the query string) become readable.
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
    const persisted = readPersisted();
    const requestedStep = readRequestedStep();
    clientBoot = {
      token: "client",
      state: persisted?.state ?? INITIAL_STATE,
      // An explicit ?step= link wins over restored progress.
      stepIndex: requestedStep ?? persisted?.stepIndex ?? 0,
    };
  }
  return clientBoot;
}

function getServerBoot(): OnboardingBoot {
  return SERVER_BOOT;
}

/** Nothing ever changes after the first client read, so there is no work here. */
function subscribe(): () => void {
  return () => {};
}

/**
 * Resolves the starting point without a hydration mismatch.
 *
 * The server and the hydrating client both see SERVER_BOOT, so the markup
 * agrees; React then swaps in the client snapshot and re-renders on its own.
 * Doing it this way — rather than restoring inside an effect — keeps the
 * restore off the render path and out of a cascading state update.
 */
export function useOnboardingBoot(): OnboardingBoot {
  return useSyncExternalStore(subscribe, getClientBoot, getServerBoot);
}

/**
 * Holds the answers for one run of the flow, seeded from `boot`.
 *
 * The flow remounts this hook when `boot.token` flips, so restored progress
 * arrives as an initial value rather than as a post-mount update.
 */
export function useOnboardingSession(boot: OnboardingBoot) {
  const [state, dispatch] = useReducer(reducer, boot.state);
  const [stepIndex, setStepIndex] = useState(boot.stepIndex);

  // Never write during the server/hydration pass: that would overwrite a saved
  // run with the defaults before the client snapshot has been applied.
  const canPersist = boot.token === "client";

  useEffect(() => {
    if (!canPersist) return;
    try {
      window.localStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        JSON.stringify({ state, stepIndex } satisfies PersistedShape)
      );
    } catch {
      // Private mode / quota — progress simply isn't restorable.
    }
  }, [canPersist, state, stepIndex]);

  const patch = useCallback((next: Partial<OnboardingState>) => {
    dispatch({ type: "patch", patch: next });
  }, []);

  const resetPlanEdits = useCallback(() => {
    dispatch({ type: "resetPlanEdits" });
  }, []);

  return { state, stepIndex, setStepIndex, patch, resetPlanEdits };
}
