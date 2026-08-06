/**
 * Step order for the Basmafit workout onboarding.
 *
 * A fork of the Nutree registry rather than an edit of it: /onboarding still
 * imports lib/onboarding/steps.ts and must keep its own 18-step numbering —
 * including the hydration screen, which this flow does not ask for.
 *
 * Nineteen numbered steps; the welcome screen is not counted. Two workout
 * questions sit directly after the Nutree protein step, and three short
 * automatic screens run the plan build before the offer.
 */

export const STEP_IDS = [
  "welcome",
  // 1–8 — the Nutree intake, unchanged.
  "personal",
  "body",
  "goal",
  "activity",
  "target",
  "pace",
  "diet",
  "protein",
  // 9–10 — the workout questions.
  "trainingLocation",
  "trainingDays",
  // 11–13 — the rest of the Nutree profile questions.
  "habits",
  "motivation",
  "tracking",
  // 14–15 — the generated plan.
  "plan",
  "summary",
  // 16–18 — automatic build screens.
  "analyzing",
  "building",
  "calculating",
  // 19 — the Basmafit offer.
  "offer",
] as const;

export type StepId = (typeof STEP_IDS)[number];

export const TOTAL_STEPS = 19;

/**
 * Number rendered in "الخطوة N من 19". The welcome screen shares step 1 with
 * the first question, exactly as the Nutree flow pairs them.
 */
const DISPLAY_STEP: Record<StepId, number> = {
  welcome: 1,
  personal: 1,
  body: 2,
  goal: 3,
  activity: 4,
  target: 5,
  pace: 6,
  diet: 7,
  protein: 8,
  trainingLocation: 9,
  trainingDays: 10,
  habits: 11,
  motivation: 12,
  tracking: 13,
  plan: 14,
  summary: 15,
  analyzing: 16,
  building: 17,
  calculating: 18,
  offer: 19,
};

export function displayStep(id: StepId): number {
  return DISPLAY_STEP[id];
}

/** Rises step by step from 5% on step 1 to 100% on the offer. */
export function stepPercent(id: StepId): number {
  return Math.round((DISPLAY_STEP[id] / TOTAL_STEPS) * 100);
}

export const LAST_STEP_INDEX = STEP_IDS.length - 1;

/** The three screens that advance on their own once their animation finishes. */
export const AUTOMATIC_STEPS: StepId[] = ["analyzing", "building", "calculating"];
