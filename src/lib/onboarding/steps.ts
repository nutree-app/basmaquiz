/**
 * Step order and the progress numbers shown in the header.
 *
 * The app pairs the welcome screen with the first data screen under
 * "الخطوة 1 من 18", so the displayed number is not the array index — it is
 * looked up here. The final screen is the Nutree Pro offer, which stands in
 * for the app's account-creation step and closes the bar at 100%.
 */

export const STEP_IDS = [
  "welcome",
  "personal",
  "body",
  "goal",
  "activity",
  "target",
  "pace",
  "diet",
  "protein",
  "habits",
  "motivation",
  "tracking",
  "referral",
  "water",
  "plan",
  "summary",
  "offer",
] as const;

export type StepId = (typeof STEP_IDS)[number];

export const TOTAL_STEPS = 18;

/** Number rendered in "الخطوة N من 18" — matches the app screen for screen. */
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
  habits: 9,
  motivation: 10,
  tracking: 11,
  referral: 12,
  water: 13,
  plan: 14,
  summary: 15,
  offer: TOTAL_STEPS,
};

export function displayStep(id: StepId): number {
  return DISPLAY_STEP[id];
}

export function stepPercent(id: StepId): number {
  return Math.round((DISPLAY_STEP[id] / TOTAL_STEPS) * 100);
}

export const LAST_STEP_INDEX = STEP_IDS.length - 1;
