import assert from "node:assert/strict";
import test from "node:test";

import { STEP_IDS, TOTAL_STEPS, displayStep, stepPercent } from "../workout-onboarding/steps";
import { getBasmafitProduct } from "../workout-onboarding/product";
import { buildTrainingSplit } from "../workout-onboarding/split";
import { INITIAL_STATE, migratePersisted } from "../workout-onboarding/state";
import {
  TRAINING_DAYS_OPTIONS,
  type WorkoutOnboardingState,
} from "../workout-onboarding/types";
import {
  trainingDaysChoices,
  trainingLocationChoices,
} from "../workout-onboarding/content";
import { PRODUCT_LINKS } from "../config";

function state(overrides: Partial<WorkoutOnboardingState> = {}): WorkoutOnboardingState {
  return { ...INITIAL_STATE, ...overrides };
}

/* ------------------------------------------------------------------ */
/* Nineteen steps                                                       */
/* ------------------------------------------------------------------ */

test("the flow is exactly 19 counted steps", () => {
  assert.equal(TOTAL_STEPS, 19);
  assert.equal(STEP_IDS.filter((id) => id !== "welcome").length, TOTAL_STEPS);
  assert.equal(displayStep("personal"), 1);
  assert.equal(displayStep("offer"), 19);
});

test("progress climbs from 5% to 100% without ever going backwards", () => {
  const counted = STEP_IDS.filter((id) => id !== "welcome");
  const percents = counted.map((id) => stepPercent(id));
  assert.deepEqual(percents, [
    5, 11, 16, 21, 26, 32, 37, 42, 47, 53, 58, 63, 68, 74, 79, 84, 89, 95, 100,
  ]);
  for (let i = 1; i < percents.length; i += 1) {
    assert.ok(percents[i] > percents[i - 1], `step ${i + 1} must advance the bar`);
  }
  assert.equal(stepPercent("welcome"), 5); // shares step 1, not counted separately
});

test("the hydration screen is gone from the flow entirely", () => {
  assert.ok(!(STEP_IDS as readonly string[]).includes("water"));
  // And a save left on it can't resurrect it.
  const restored = migratePersisted({ stepId: "water", state: state({ goal: "lose" }) })!;
  assert.equal(restored.stepId, "welcome");
  assert.equal(restored.state.waterMl, null);
});

test("the two workout questions are steps 9 and 10", () => {
  assert.equal(displayStep("trainingLocation"), 9);
  assert.equal(displayStep("trainingDays"), 10);
  // Directly after the Nutree protein step.
  assert.equal(displayStep("protein"), 8);
});

test("all Nutree intake steps survive, in order, none duplicated", () => {
  assert.deepEqual(STEP_IDS.filter((id) => id !== "welcome"), [
    "personal", "body", "goal", "activity", "target", "pace", "diet", "protein",
    "trainingLocation", "trainingDays",
    "habits", "motivation", "tracking",
    "plan", "summary",
    "analyzing", "building", "calculating",
    "offer",
  ]);
  assert.equal(new Set(STEP_IDS).size, STEP_IDS.length, "no step appears twice");
});

test("every counted step has a unique display number", () => {
  const counted = STEP_IDS.filter((id) => id !== "welcome");
  const numbers = counted.map((id) => displayStep(id));
  assert.equal(new Set(numbers).size, numbers.length);
});

/* ------------------------------------------------------------------ */
/* The two new questions                                                */
/* ------------------------------------------------------------------ */

test("training location offers home then gym with the right emojis", () => {
  assert.deepEqual(trainingLocationChoices.map((c) => c.value), ["home", "gym"]);
  assert.deepEqual(trainingLocationChoices.map((c) => c.title), ["المنزل", "النادي الرياضي"]);
  assert.equal(trainingLocationChoices[0].emoji, "🏠");
  assert.ok(trainingLocationChoices[1].emoji.startsWith("🏋"));
});

test("training days offers 2 through 6", () => {
  assert.deepEqual(trainingDaysChoices.map((c) => c.value), ["2", "3", "4", "5", "6"]);
  assert.deepEqual(
    trainingDaysChoices.map((c) => c.title),
    ["2 أيام", "3 أيام", "4 أيام", "5 أيام", "6 أيام"]
  );
});

/* ------------------------------------------------------------------ */
/* Goal-based Basmafit product routing                                  */
/* ------------------------------------------------------------------ */

test("weight loss opens the Basmafit cutting product", () => {
  const p = getBasmafitProduct("lose");
  assert.equal(p.key, "CUTTING_PACKAGE");
  assert.equal(p.url, PRODUCT_LINKS.CUTTING_PACKAGE);
  assert.ok(p.url.startsWith("https://basmafit.com/"));
});

test("weight gain opens the Basmafit bulking product", () => {
  const p = getBasmafitProduct("gain");
  assert.equal(p.key, "BULKING_PACKAGE");
  assert.equal(p.url, PRODUCT_LINKS.BULKING_PACKAGE);
});

test("maintain keeps the existing default product", () => {
  assert.equal(getBasmafitProduct("maintain").url, PRODUCT_LINKS.TALATI_GHEIR);
  assert.equal(getBasmafitProduct(null).url, PRODUCT_LINKS.TALATI_GHEIR);
});

test("every goal routes to a distinct basmafit.com product, never another brand", () => {
  const urls = (["lose", "gain", "maintain"] as const).map((g) => getBasmafitProduct(g).url);
  assert.equal(new Set(urls).size, 3, "each goal has its own product");
  for (const url of urls) {
    assert.ok(url.startsWith("https://basmafit.com/"), url);
    for (const foreign of ["coach-nada", "memafit", "nena-fit", "getnutree"]) {
      assert.ok(!url.includes(foreign), `${url} must not point at ${foreign}`);
    }
  }
});

/* ------------------------------------------------------------------ */
/* The split honours both workout answers                               */
/* ------------------------------------------------------------------ */

test("the schedule has exactly as many days as selected", () => {
  for (const days of TRAINING_DAYS_OPTIONS) {
    for (const location of ["home", "gym"] as const) {
      const split = buildTrainingSplit(state({ trainingLocation: location, trainingDays: days }))!;
      assert.ok(split);
      assert.equal(split.schedule.length, days, `${location}/${days}`);
    }
  }
});

test("3 days never yields a 5-day week", () => {
  const split = buildTrainingSplit(state({ trainingLocation: "home", trainingDays: 3 }))!;
  assert.equal(split.schedule.length, 3);
  assert.notEqual(split.schedule.length, 5);
});

test("home plans never reference gym equipment", () => {
  const equipment = ["بالبار", "كيبل", "ماكينة", "Leg Press", "السير", "دراجة ثابتة"];
  for (const days of TRAINING_DAYS_OPTIONS) {
    const split = buildTrainingSplit(state({ trainingLocation: "home", trainingDays: days }))!;
    for (const day of split.schedule) {
      for (const exercise of day.exercises) {
        for (const term of equipment) {
          assert.ok(!exercise.includes(term), `home leaked "${term}" via "${exercise}"`);
        }
      }
    }
  }
});

test("home + 3 days differs from gym + 5 days", () => {
  const home3 = buildTrainingSplit(state({ trainingLocation: "home", trainingDays: 3 }))!;
  const gym5 = buildTrainingSplit(state({ trainingLocation: "gym", trainingDays: 5 }))!;
  assert.notEqual(home3.schedule.length, gym5.schedule.length);
  assert.notEqual(home3.splitName, gym5.splitName);
});

test("goal changes the volume prescription", () => {
  const base = { trainingLocation: "gym", trainingDays: 4 } as const;
  const lose = buildTrainingSplit(state({ ...base, goal: "lose" }))!;
  const gain = buildTrainingSplit(state({ ...base, goal: "gain" }))!;
  assert.notEqual(lose.intensity, gain.intensity);
});

test("no split until both workout answers exist", () => {
  assert.equal(buildTrainingSplit(state()), null);
  assert.equal(buildTrainingSplit(state({ trainingLocation: "gym" })), null);
  assert.equal(buildTrainingSplit(state({ trainingDays: 3 })), null);
});

/* ------------------------------------------------------------------ */
/* Persistence and migration                                            */
/* ------------------------------------------------------------------ */

test("a valid save round-trips, keeping both workout answers", () => {
  const saved = {
    version: 1,
    stepId: "trainingDays",
    state: state({ trainingLocation: "gym", trainingDays: 5, goal: "lose", weightKg: 72 }),
  };
  const restored = migratePersisted(saved)!;
  assert.equal(restored.stepId, "trainingDays");
  assert.equal(restored.state.trainingLocation, "gym");
  assert.equal(restored.state.trainingDays, 5);
  assert.equal(restored.state.goal, "lose");
  assert.equal(restored.state.weightKg, 72);
});

test("an unknown step id restarts at the welcome screen instead of crashing", () => {
  const restored = migratePersisted({ stepId: "referral", state: state({ goal: "gain" }) })!;
  assert.equal(restored.stepId, "welcome");
  assert.equal(restored.state.goal, "gain", "answers still survive");
});

test("old 8-step workout data cannot crash the flow", () => {
  const legacy = {
    stepId: "programType",
    state: { goal: "خسارة الوزن", trainingLocation: "المنزل", trainingDays: "3 أيام", level: "مبتدئة" },
  };
  const restored = migratePersisted(legacy)!;
  assert.equal(restored.stepId, "welcome");
  // Values that don't fit the new vocabulary are dropped, not half-applied.
  assert.equal(restored.state.trainingLocation, null);
  assert.equal(restored.state.trainingDays, null);
});

test("garbage saves are rejected rather than throwing", () => {
  for (const input of [null, undefined, 42, "nope", [], {}, { state: 5 }]) {
    assert.doesNotThrow(() => migratePersisted(input));
  }
  assert.equal(migratePersisted(null), null);
  assert.equal(migratePersisted({}), null);
});

test("out-of-range numbers are clamped on restore", () => {
  const restored = migratePersisted({
    stepId: "body",
    state: { ...INITIAL_STATE, age: 999, heightCm: -5, weightKg: 9999 },
  })!;
  assert.ok(restored.state.age <= 100 && restored.state.age >= 13);
  assert.ok(restored.state.heightCm >= 120);
  assert.ok(restored.state.weightKg <= 200);
});
