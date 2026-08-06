import assert from "node:assert/strict";
import test from "node:test";

import { QUIZ_STATE_KEYS, resetQuizState } from "../storage";
import { buildWorkoutPlan, type WorkoutPlanInput } from "../workout-plan";
import {
  getPrimaryRecommendation,
  getRecommendedProducts,
  hasExclusiveRecommendation,
} from "../recommendation";
import { QUIZ_STEPS, TOTAL_STEPS, validateStep } from "../quiz-steps";
import { EMPTY_ANSWERS, type QuizAnswers } from "../types";

function answers(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

function planInput(overrides: Partial<WorkoutPlanInput> = {}): WorkoutPlanInput {
  return { trainingLocation: "", trainingDays: 0, ...overrides };
}

const TABLES_ONLY = "جدول تمارين فقط، بدون متابعة وبدون نظام غذائي";
const FULL_PROGRAM = "نظام غذائي + جدول تمارين + متابعة";

const TRAINING_DAYS_OPTIONS = [2, 3, 4, 5, 6] as const;

/* ------------------------------------------------------------------ */
/* Every visit starts fresh                                             */
/* ------------------------------------------------------------------ */

test("resetQuizState wipes this flow's keys and nothing else", () => {
  const store = new Map<string, string>([
    ["basmafit_quiz_answers", '{"goal":"خسارة الوزن"}'],
    ["basmafit_quiz_progress", '{"screen":"result","stepIndex":7}'],
    ["basmafit_lead", '{"selectedProductTitle":"باقة التنشيف"}'],
    ["some_other_site_key", "keep me"],
  ]);
  const fake = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  };

  const g = globalThis as unknown as { window?: unknown };
  const previous = g.window;
  g.window = { localStorage: fake, sessionStorage: fake };
  try {
    resetQuizState();
  } finally {
    g.window = previous;
  }

  assert.equal(store.has("basmafit_quiz_answers"), false);
  assert.equal(store.has("basmafit_quiz_progress"), false);
  // The purchase record /success reads must survive, as must unrelated data.
  assert.equal(store.get("basmafit_lead"), '{"selectedProductTitle":"باقة التنشيف"}');
  assert.equal(store.get("some_other_site_key"), "keep me");
});

test("the flow only owns its two onboarding keys", () => {
  assert.deepEqual(
    [...QUIZ_STATE_KEYS],
    ["basmafit_quiz_answers", "basmafit_quiz_progress"]
  );
  assert.ok(!QUIZ_STATE_KEYS.includes("basmafit_lead" as never));
});

test("resetQuizState is safe with no window (server render)", () => {
  assert.doesNotThrow(() => resetQuizState());
});

/* ------------------------------------------------------------------ */
/* Step order — the eight questions, in the reference order             */
/* ------------------------------------------------------------------ */

test("the flow is 8 steps in the reference order", () => {
  assert.equal(TOTAL_STEPS, 8);
  assert.deepEqual(
    QUIZ_STEPS.map((s) => s.id),
    [
      "goal",
      "trainingPreference",
      "level",
      "weeklyDays",
      "gender",
      "age",
      "heightWeight",
      "programType",
    ]
  );
});

test("no question is asked twice", () => {
  const ids = QUIZ_STEPS.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("training preference offers three places, each with its own icon", () => {
  const step = QUIZ_STEPS.find((s) => s.id === "trainingPreference");
  assert.ok(step?.kind === "choice");
  assert.equal(step.question, "أين تفضلين التمرين؟");
  assert.deepEqual(step.options, ["النادي", "المنزل", "المنزل والنادي معًا"]);
  for (const option of step.options) {
    assert.ok(step.icons?.[option], `${option} needs an icon`);
  }
});

test("weekly days offers 2 through 5", () => {
  const step = QUIZ_STEPS.find((s) => s.id === "weeklyDays");
  assert.ok(step?.kind === "choice");
  assert.equal(step.question, "كم مرة تستطيعين التمرين أسبوعياً؟");
  assert.deepEqual(step.options, ["2 أيام", "3 أيام", "4 أيام", "5 أيام"]);
});

test("the long program-type answer is shown under a short label", () => {
  const step = QUIZ_STEPS.find((s) => s.id === "programType");
  assert.ok(step?.kind === "choice");
  assert.deepEqual(step.options, [FULL_PROGRAM, TABLES_ONLY]);
  // The stored value stays long; only the card text is shortened.
  assert.equal(step.labels?.[TABLES_ONLY], "جدول تمارين فقط");
  assert.equal(step.labels?.[FULL_PROGRAM], undefined);
});

test("progress percentages land on the expected values", () => {
  const percents = QUIZ_STEPS.map((_, i) => Math.round(((i + 1) / TOTAL_STEPS) * 100));
  assert.deepEqual(percents, [13, 25, 38, 50, 63, 75, 88, 100]);
});

test("choice steps cannot be skipped without answering", () => {
  for (const step of QUIZ_STEPS.filter((s) => s.kind === "choice")) {
    assert.ok(validateStep(step, answers()), `${step.id} must be required`);
  }
  // The wheel and height/weight steps always carry a default, so they pass.
  for (const step of QUIZ_STEPS.filter((s) => s.kind !== "choice")) {
    assert.equal(validateStep(step, answers()), null);
  }
  const goal = QUIZ_STEPS[0];
  assert.equal(validateStep(goal, answers({ goal: "خسارة الوزن" })), null);
});

/* ------------------------------------------------------------------ */
/* Recommendation                                                       */
/* ------------------------------------------------------------------ */

test("tables-only follows the training place", () => {
  assert.deepEqual(
    getRecommendedProducts(answers({ programType: TABLES_ONLY, trainingPreference: "المنزل" })),
    ["HOME_TABLE"]
  );
  assert.deepEqual(
    getRecommendedProducts(answers({ programType: TABLES_ONLY, trainingPreference: "النادي" })),
    ["GYM_TABLE"]
  );
  assert.deepEqual(
    getRecommendedProducts(
      answers({ programType: TABLES_ONLY, trainingPreference: "المنزل والنادي معًا" })
    ),
    ["HOME_TABLE", "GYM_TABLE"]
  );
});

test("a goal with its own product wins over the program type", () => {
  assert.deepEqual(
    getRecommendedProducts(answers({ goal: "خسارة الوزن", programType: FULL_PROGRAM })),
    ["CUTTING_PACKAGE"]
  );
  assert.deepEqual(
    getRecommendedProducts(answers({ goal: "بناء العضلات", programType: FULL_PROGRAM })),
    ["BULKING_PACKAGE"]
  );
});

test("the full programme goes to طلتي غير, and the fallback to التنشيف", () => {
  assert.deepEqual(
    getRecommendedProducts(answers({ goal: "المحافظة على الوزن", programType: FULL_PROGRAM })),
    ["TALATI_GHEIR"]
  );
  assert.deepEqual(
    getRecommendedProducts(answers({ goal: "تحسين اللياقة", programType: FULL_PROGRAM })),
    ["TALATI_GHEIR"]
  );
  assert.deepEqual(getRecommendedProducts(answers()), ["CUTTING_PACKAGE"]);
});

test("the primary recommendation is the first of the list", () => {
  assert.equal(
    getPrimaryRecommendation(
      answers({ programType: TABLES_ONLY, trainingPreference: "المنزل والنادي معًا" })
    ),
    "HOME_TABLE"
  );
  assert.equal(getPrimaryRecommendation(answers({ goal: "بناء العضلات" })), "BULKING_PACKAGE");
});

test("only exclusive results hide the tables section", () => {
  assert.equal(hasExclusiveRecommendation(answers({ programType: TABLES_ONLY })), true);
  assert.equal(hasExclusiveRecommendation(answers({ goal: "خسارة الوزن" })), true);
  assert.equal(hasExclusiveRecommendation(answers({ goal: "بناء العضلات" })), true);
  assert.equal(
    hasExclusiveRecommendation(answers({ goal: "المحافظة على الوزن", programType: FULL_PROGRAM })),
    false
  );
  assert.equal(hasExclusiveRecommendation(answers()), false);
});

/* ------------------------------------------------------------------ */
/* The shared plan builder honours location and days                    */
/* ------------------------------------------------------------------ */

test("every offered day count produces exactly that many training days", () => {
  for (const days of TRAINING_DAYS_OPTIONS) {
    for (const location of ["gym", "home"] as const) {
      const plan = buildWorkoutPlan(
        planInput({ trainingLocation: location, trainingDays: days })
      );
      assert.ok(plan, `${location}/${days} should build`);
      assert.equal(plan.schedule.length, days, `${location}: expected ${days} days`);
    }
  }
});

test("home + 3 days differs from gym + 5 days", () => {
  const home3 = buildWorkoutPlan(planInput({ trainingLocation: "home", trainingDays: 3 }))!;
  const gym5 = buildWorkoutPlan(planInput({ trainingLocation: "gym", trainingDays: 5 }))!;

  assert.notEqual(home3.schedule.length, gym5.schedule.length);
  assert.notEqual(home3.splitName, gym5.splitName);
  assert.notDeepEqual(
    home3.schedule.map((d) => d.exercises),
    gym5.schedule.map((d) => d.exercises)
  );
});

test("same days, different location still yields different exercises", () => {
  const home = buildWorkoutPlan(planInput({ trainingLocation: "home", trainingDays: 4 }))!;
  const gym = buildWorkoutPlan(planInput({ trainingLocation: "gym", trainingDays: 4 }))!;
  assert.equal(home.schedule.length, gym.schedule.length);
  assert.notDeepEqual(
    home.schedule.map((d) => d.exercises),
    gym.schedule.map((d) => d.exercises)
  );
});

test("home plans never reference gym equipment", () => {
  const equipment = ["بالبار", "كيبل", "ماكينة", "Leg Press", "السير", "دراجة ثابتة"];
  for (const days of TRAINING_DAYS_OPTIONS) {
    const plan = buildWorkoutPlan(
      planInput({ trainingLocation: "home", trainingDays: days, level: "متقدمة" })
    )!;
    for (const day of plan.schedule) {
      for (const exercise of day.exercises) {
        for (const term of equipment) {
          assert.ok(!exercise.includes(term), `home plan leaked "${term}" via "${exercise}"`);
        }
      }
    }
  }
});

test("gym plans do use gym equipment", () => {
  const plan = buildWorkoutPlan(
    planInput({ trainingLocation: "gym", trainingDays: 5, level: "متقدمة" })
  )!;
  const all = plan.schedule.flatMap((d) => d.exercises).join(" ");
  assert.ok(/بالبار|كيبل|ماكينة/.test(all));
});

test("level changes volume, goal changes the prescription", () => {
  const base = { trainingLocation: "gym", trainingDays: 3 } as const;
  const beginner = buildWorkoutPlan(planInput({ ...base, level: "مبتدئة" }))!;
  const advanced = buildWorkoutPlan(planInput({ ...base, level: "متقدمة" }))!;
  assert.ok(advanced.schedule[0].exercises.length > beginner.schedule[0].exercises.length);

  const cut = buildWorkoutPlan(planInput({ ...base, goal: "خسارة الوزن" }))!;
  const bulk = buildWorkoutPlan(planInput({ ...base, goal: "بناء العضلات" }))!;
  assert.notEqual(cut.intensity, bulk.intensity);
});

test("gender shifts the lower-body emphasis without changing the day count", () => {
  const base = { trainingLocation: "home", trainingDays: 3, level: "متقدمة" } as const;
  const female = buildWorkoutPlan(planInput({ ...base, gender: "أنثى" }))!;
  const male = buildWorkoutPlan(planInput({ ...base, gender: "ذكر" }))!;

  assert.equal(female.schedule.length, male.schedule.length);
  const femaleLower = female.schedule.find((d) => d.title.includes("السفلي"))!;
  const maleLower = male.schedule.find((d) => d.title.includes("السفلي"))!;
  assert.notDeepEqual(femaleLower.exercises, maleLower.exercises);
  assert.equal(femaleLower.exercises[0], "جسر المؤخرة");
  // Same movements, only reordered — nothing added or dropped.
  assert.deepEqual([...femaleLower.exercises].sort(), [...maleLower.exercises].sort());
});

test("no plan is built until both driving answers exist", () => {
  assert.equal(buildWorkoutPlan(planInput()), null);
  assert.equal(buildWorkoutPlan(planInput({ trainingLocation: "gym" })), null);
  assert.equal(buildWorkoutPlan(planInput({ trainingDays: 3 })), null);
});
