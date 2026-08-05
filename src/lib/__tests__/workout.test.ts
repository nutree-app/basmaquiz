import assert from "node:assert/strict";
import test from "node:test";

import { WORKOUT_STATE_KEYS, clearWorkoutState } from "../storage";
import { buildWorkoutPlan } from "../workout-plan";
import { getRecommendedProduct } from "../recommendation";
import { QUIZ_STEPS, TOTAL_STEPS, validateStep } from "../quiz-steps";
import { EMPTY_ANSWERS, TRAINING_DAYS_OPTIONS, type QuizAnswers } from "../types";

function answers(overrides: Partial<QuizAnswers> = {}): QuizAnswers {
  return { ...EMPTY_ANSWERS, ...overrides };
}

/* ------------------------------------------------------------------ */
/* Every visit starts fresh                                             */
/* ------------------------------------------------------------------ */

test("clearWorkoutState wipes this flow's keys and nothing else", () => {
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
    clearWorkoutState();
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
    [...WORKOUT_STATE_KEYS],
    ["basmafit_quiz_answers", "basmafit_quiz_progress"]
  );
  assert.ok(!WORKOUT_STATE_KEYS.includes("basmafit_lead" as never));
});

test("clearWorkoutState is safe with no window (server render)", () => {
  assert.doesNotThrow(() => clearWorkoutState());
});

/* ------------------------------------------------------------------ */
/* Step order and the two relocated questions                           */
/* ------------------------------------------------------------------ */

test("the flow is 8 steps, ending with location then days", () => {
  assert.equal(TOTAL_STEPS, 8);
  assert.deepEqual(
    QUIZ_STEPS.map((s) => s.id),
    [
      "goal",
      "level",
      "gender",
      "age",
      "heightWeight",
      "programType",
      "trainingLocation",
      "trainingDays",
    ]
  );
});

test("neither question is asked twice", () => {
  const ids = QUIZ_STEPS.map((s) => s.id);
  assert.equal(ids.filter((id) => id === "trainingLocation").length, 1);
  assert.equal(ids.filter((id) => id === "trainingDays").length, 1);
});

test("location offers home then gym, each with its own emoji", () => {
  const step = QUIZ_STEPS.find((s) => s.id === "trainingLocation");
  assert.ok(step?.kind === "choice");
  assert.equal(step.question, "وين مكان التمرين؟");
  assert.deepEqual(
    step.options.map((o) => o.value),
    ["home", "gym"]
  );
  assert.deepEqual(
    step.options.map((o) => o.label),
    ["المنزل", "النادي الرياضي"]
  );
  for (const option of step.options) {
    assert.ok(option.emoji && option.emoji.length > 0, `${option.label} needs an emoji`);
  }
});

test("days offers 2 through 6", () => {
  const step = QUIZ_STEPS.find((s) => s.id === "trainingDays");
  assert.ok(step?.kind === "choice");
  assert.equal(step.question, "كم يوم تتمرن بالأسبوع؟");
  assert.deepEqual(
    step.options.map((o) => o.value),
    [2, 3, 4, 5, 6]
  );
  assert.deepEqual(
    step.options.map((o) => o.label),
    ["2 أيام", "3 أيام", "4 أيام", "5 أيام", "6 أيام"]
  );
});

test("progress percentages land on the expected values", () => {
  const percents = QUIZ_STEPS.map((_, i) => Math.round(((i + 1) / TOTAL_STEPS) * 100));
  assert.deepEqual(percents, [13, 25, 38, 50, 63, 75, 88, 100]);
});

test("neither final step can be skipped without answering", () => {
  const location = QUIZ_STEPS.find((s) => s.id === "trainingLocation")!;
  const days = QUIZ_STEPS.find((s) => s.id === "trainingDays")!;

  assert.ok(validateStep(location, answers()), "location must be required");
  assert.ok(validateStep(days, answers()), "days must be required");

  assert.equal(validateStep(location, answers({ trainingLocation: "home" })), null);
  assert.equal(validateStep(days, answers({ trainingDays: 2 })), null);
});

/* ------------------------------------------------------------------ */
/* The plan honours location and days                                   */
/* ------------------------------------------------------------------ */

test("every offered day count produces exactly that many training days", () => {
  for (const days of TRAINING_DAYS_OPTIONS) {
    for (const location of ["gym", "home"] as const) {
      const plan = buildWorkoutPlan(
        answers({ trainingLocation: location, trainingDays: days })
      );
      assert.ok(plan, `${location}/${days} should build`);
      assert.equal(plan.schedule.length, days, `${location}: expected ${days} days`);
    }
  }
});

test("home + 3 days differs from gym + 5 days", () => {
  const home3 = buildWorkoutPlan(answers({ trainingLocation: "home", trainingDays: 3 }))!;
  const gym5 = buildWorkoutPlan(answers({ trainingLocation: "gym", trainingDays: 5 }))!;

  assert.notEqual(home3.schedule.length, gym5.schedule.length);
  assert.notEqual(home3.splitName, gym5.splitName);
  assert.notDeepEqual(
    home3.schedule.map((d) => d.exercises),
    gym5.schedule.map((d) => d.exercises)
  );
});

test("same days, different location still yields different exercises", () => {
  const home = buildWorkoutPlan(answers({ trainingLocation: "home", trainingDays: 4 }))!;
  const gym = buildWorkoutPlan(answers({ trainingLocation: "gym", trainingDays: 4 }))!;
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
      answers({ trainingLocation: "home", trainingDays: days, level: "متقدمة" })
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
    answers({ trainingLocation: "gym", trainingDays: 5, level: "متقدمة" })
  )!;
  const all = plan.schedule.flatMap((d) => d.exercises).join(" ");
  assert.ok(/بالبار|كيبل|ماكينة/.test(all));
});

test("level changes volume, goal changes the prescription", () => {
  const base = { trainingLocation: "gym", trainingDays: 3 } as const;
  const beginner = buildWorkoutPlan(answers({ ...base, level: "مبتدئة" }))!;
  const advanced = buildWorkoutPlan(answers({ ...base, level: "متقدمة" }))!;
  assert.ok(advanced.schedule[0].exercises.length > beginner.schedule[0].exercises.length);

  const cut = buildWorkoutPlan(answers({ ...base, goal: "خسارة الوزن" }))!;
  const bulk = buildWorkoutPlan(answers({ ...base, goal: "بناء العضلات" }))!;
  assert.notEqual(cut.intensity, bulk.intensity);
});

test("gender shifts the lower-body emphasis without changing the day count", () => {
  const base = { trainingLocation: "home", trainingDays: 3, level: "متقدمة" } as const;
  const female = buildWorkoutPlan(answers({ ...base, gender: "أنثى" }))!;
  const male = buildWorkoutPlan(answers({ ...base, gender: "ذكر" }))!;

  assert.equal(female.schedule.length, male.schedule.length);
  const femaleLower = female.schedule.find((d) => d.title.includes("السفلي"))!;
  const maleLower = male.schedule.find((d) => d.title.includes("السفلي"))!;
  assert.notDeepEqual(femaleLower.exercises, maleLower.exercises);
  assert.equal(femaleLower.exercises[0], "جسر المؤخرة");
  // Same movements, only reordered — nothing added or dropped.
  assert.deepEqual([...femaleLower.exercises].sort(), [...maleLower.exercises].sort());
});

test("no plan is built until both driving answers exist", () => {
  assert.equal(buildWorkoutPlan(answers()), null);
  assert.equal(buildWorkoutPlan(answers({ trainingLocation: "gym" })), null);
  assert.equal(buildWorkoutPlan(answers({ trainingDays: 3 })), null);
});

/* ------------------------------------------------------------------ */
/* Existing recommendation behaviour                                    */
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

test("the comprehensive package is reachable at the top of the day scale", () => {
  assert.equal(
    getRecommendedProduct(answers({ goal: "خسارة الوزن", trainingDays: 6 })),
    "FULL_PACKAGE"
  );
});
