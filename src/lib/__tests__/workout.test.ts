import assert from "node:assert/strict";
import test from "node:test";

import { migrateAnswers } from "../storage";
import { buildWorkoutPlan } from "../workout-plan";
import { getRecommendedProduct } from "../recommendation";
import { QUIZ_STEPS, TOTAL_STEPS, validateStep } from "../quiz-steps";
import { EMPTY_ANSWERS, type QuizAnswers } from "../types";

function answers(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

/* ------------------------------------------------------------------ */
/* Migration — a v1 save must never crash the flow                      */
/* ------------------------------------------------------------------ */

test("migrates a v1 answer set to the new fields", () => {
  const v1 = {
    goal: "خسارة الوزن",
    trainingPreference: "المنزل",
    level: "متوسطة",
    weeklyDays: "4 أيام",
    gender: "أنثى",
    age: 30,
    height: 165,
    weight: 70,
    programType: "جدول تمارين + متابعة",
  };

  const migrated = migrateAnswers(v1);
  assert.equal(migrated.trainingLocation, "home");
  assert.equal(migrated.trainingDays, 5); // 4 أيام folds onto the nearest option
  assert.equal(migrated.goal, "خسارة الوزن");
  assert.equal(migrated.age, 30);
});

test("the retired 'both locations' answer becomes gym", () => {
  const migrated = migrateAnswers({ trainingPreference: "المنزل والنادي معًا" });
  assert.equal(migrated.trainingLocation, "gym");
});

test("2 and 3 day answers fold onto 3 days", () => {
  assert.equal(migrateAnswers({ weeklyDays: "2 أيام" }).trainingDays, 3);
  assert.equal(migrateAnswers({ weeklyDays: "3 أيام" }).trainingDays, 3);
});

test("garbage and partial saves fall back instead of throwing", () => {
  for (const input of [null, undefined, 42, "nope", [], { goal: 12, age: "x" }]) {
    const migrated = migrateAnswers(input);
    assert.equal(typeof migrated.age, "number");
    assert.ok(migrated.trainingDays === 0 || [3, 5, 7].includes(migrated.trainingDays));
    assert.ok(["", "gym", "home"].includes(migrated.trainingLocation));
  }
});

test("already-migrated answers pass through untouched", () => {
  const v2 = answers({ trainingLocation: "gym", trainingDays: 7, goal: "بناء العضلات" });
  const migrated = migrateAnswers(v2);
  assert.equal(migrated.trainingLocation, "gym");
  assert.equal(migrated.trainingDays, 7);
});

/* ------------------------------------------------------------------ */
/* The generated plan honours both new answers                          */
/* ------------------------------------------------------------------ */

test("the schedule has exactly as many days as the user selected", () => {
  for (const days of [3, 5, 7] as const) {
    const plan = buildWorkoutPlan(answers({ trainingLocation: "gym", trainingDays: days }));
    assert.ok(plan);
    assert.equal(plan.schedule.length, days, `expected ${days} training days`);
    assert.equal(plan.days, days);
  }
});

test("a 3-day answer never produces a 5-day week", () => {
  const plan = buildWorkoutPlan(answers({ trainingLocation: "home", trainingDays: 3 }));
  assert.ok(plan);
  assert.notEqual(plan.schedule.length, 5);
  assert.equal(plan.schedule.length, 3);
});

test("home plans contain no gym equipment", () => {
  const plan = buildWorkoutPlan(
    answers({ trainingLocation: "home", trainingDays: 7, level: "متقدمة" })
  );
  assert.ok(plan);

  const equipment = ["بالبار", "كيبل", "ماكينة", "Leg Press", "السير", "دراجة ثابتة"];
  for (const day of plan.schedule) {
    for (const exercise of day.exercises) {
      for (const term of equipment) {
        assert.ok(
          !exercise.includes(term),
          `home plan should not include "${term}" — found in "${exercise}"`
        );
      }
    }
  }
});

test("gym plans do use gym equipment", () => {
  const plan = buildWorkoutPlan(
    answers({ trainingLocation: "gym", trainingDays: 5, level: "متقدمة" })
  );
  assert.ok(plan);
  const all = plan.schedule.flatMap((d) => d.exercises).join(" ");
  assert.ok(/بالبار|كيبل|ماكينة/.test(all), "gym plan should reference gym equipment");
});

test("every day has at least four movements and none repeat within a day", () => {
  const plan = buildWorkoutPlan(
    answers({ trainingLocation: "gym", trainingDays: 7, level: "مبتدئة" })
  );
  assert.ok(plan);
  for (const day of plan.schedule) {
    assert.ok(day.exercises.length >= 4, "each day needs at least four exercises");
    assert.equal(new Set(day.exercises).size, day.exercises.length);
  }
});

test("level changes the volume per session", () => {
  const base = { trainingLocation: "gym", trainingDays: 3 } as const;
  const beginner = buildWorkoutPlan(answers({ ...base, level: "مبتدئة" }));
  const advanced = buildWorkoutPlan(answers({ ...base, level: "متقدمة" }));
  assert.ok(beginner && advanced);
  assert.ok(advanced.schedule[0].exercises.length > beginner.schedule[0].exercises.length);
});

test("no plan is built until both driving answers exist", () => {
  assert.equal(buildWorkoutPlan(answers()), null);
  assert.equal(buildWorkoutPlan(answers({ trainingLocation: "gym" })), null);
  assert.equal(buildWorkoutPlan(answers({ trainingDays: 3 })), null);
});

/* ------------------------------------------------------------------ */
/* Existing recommendation behaviour still works                        */
/* ------------------------------------------------------------------ */

test("goal-based product recommendations are unchanged", () => {
  assert.equal(
    getRecommendedProduct(answers({ goal: "المحافظة على الوزن", trainingDays: 3 })),
    "TALATI_GHEIR"
  );
  assert.equal(
    getRecommendedProduct(answers({ goal: "خسارة الوزن", trainingDays: 3 })),
    "CUTTING_PACKAGE"
  );
  assert.equal(
    getRecommendedProduct(answers({ goal: "بناء العضلات", trainingDays: 5 })),
    "BULKING_PACKAGE"
  );
  assert.equal(getRecommendedProduct(answers()), "CUTTING_PACKAGE");
});

test("the comprehensive package is still reachable", () => {
  assert.equal(
    getRecommendedProduct(answers({ goal: "خسارة الوزن", trainingDays: 7 })),
    "FULL_PACKAGE"
  );
});

/* ------------------------------------------------------------------ */
/* Step wiring                                                          */
/* ------------------------------------------------------------------ */

test("the flow keeps all eight questions, with the two redesigned ones in place", () => {
  assert.equal(TOTAL_STEPS, 8);
  assert.deepEqual(
    QUIZ_STEPS.map((s) => s.id),
    [
      "goal",
      "trainingLocation",
      "level",
      "trainingDays",
      "gender",
      "age",
      "heightWeight",
      "programType",
    ]
  );
});

test("the new steps offer exactly the specified options", () => {
  const location = QUIZ_STEPS.find((s) => s.id === "trainingLocation");
  const days = QUIZ_STEPS.find((s) => s.id === "trainingDays");
  assert.ok(location?.kind === "choice" && days?.kind === "choice");
  assert.deepEqual(location.options.map((o) => o.value), ["gym", "home"]);
  assert.deepEqual(days.options.map((o) => o.value), [3, 5, 7]);
});

test("neither new step can be skipped without answering", () => {
  const location = QUIZ_STEPS.find((s) => s.id === "trainingLocation")!;
  const days = QUIZ_STEPS.find((s) => s.id === "trainingDays")!;

  assert.ok(validateStep(location, answers()), "location must be required");
  assert.ok(validateStep(days, answers()), "days must be required");

  assert.equal(validateStep(location, answers({ trainingLocation: "home" })), null);
  assert.equal(validateStep(days, answers({ trainingDays: 3 })), null);
});
