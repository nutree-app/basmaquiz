import {
  type BasmaFitLead,
  DEFAULT_AGE,
  DEFAULT_HEIGHT,
  DEFAULT_WEIGHT,
  EMPTY_ANSWERS,
  type ProductKey,
  type QuizAnswers,
  TRAINING_DAYS_LABEL,
  TRAINING_LOCATION_LABEL,
  type TrainingDays,
  type TrainingLocation,
} from "./types";
import { calculateBmi } from "./recommendation";

const ANSWERS_KEY = "basmafit_quiz_answers";
const LEAD_KEY = "basmafit_lead";
const PROGRESS_KEY = "basmafit_quiz_progress";

/**
 * Bump when the saved shape changes in a way migrateAnswers() must handle.
 * v2: `trainingPreference` (three Arabic labels) became `trainingLocation`
 *     (gym|home), and `weeklyDays` ("2 أيام"…) became numeric `trainingDays`
 *     (3|5|7).
 */
export const QUIZ_STATE_VERSION = 2;

interface StoredAnswers {
  version?: number;
  answers?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function pickString<T extends string>(value: unknown, allowed: readonly T[]): T | "" {
  return typeof value === "string" && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : "";
}

function pickNumber(value: unknown, fallback: number, min: number, max: number): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

/** "المنزل والنادي معًا" no longer exists; those users are treated as gym-equipped. */
function migrateTrainingLocation(raw: Record<string, unknown>): TrainingLocation | "" {
  const current = raw.trainingLocation;
  if (current === "gym" || current === "home") return current;

  switch (raw.trainingPreference) {
    case "المنزل":
      return "home";
    case "النادي":
    case "المنزل والنادي معًا":
      return "gym";
    default:
      return "";
  }
}

/** Old buckets were 2/3/4/5 days; they fold onto the nearest offered option. */
function migrateTrainingDays(raw: Record<string, unknown>): TrainingDays | 0 {
  const current = raw.trainingDays;
  if (current === 3 || current === 5 || current === 7) return current;

  switch (raw.weeklyDays) {
    case "2 أيام":
    case "3 أيام":
      return 3;
    case "4 أيام":
    case "5 أيام":
      return 5;
    default:
      return 0;
  }
}

/**
 * Turns anything previously written to localStorage into a valid QuizAnswers.
 * Unknown or corrupt fields fall back to "unanswered" rather than throwing, so
 * a stale v1 save can never crash the flow — it just re-asks what it cannot map.
 */
export function migrateAnswers(raw: unknown): QuizAnswers {
  if (!isRecord(raw)) return { ...EMPTY_ANSWERS };

  return {
    goal: pickString(raw.goal, [
      "خسارة الوزن",
      "بناء العضلات",
      "المحافظة على الوزن",
      "تحسين اللياقة",
    ] as const),
    trainingLocation: migrateTrainingLocation(raw),
    level: pickString(raw.level, ["مبتدئة", "متوسطة", "متقدمة"] as const),
    trainingDays: migrateTrainingDays(raw),
    gender: pickString(raw.gender, ["أنثى", "ذكر"] as const),
    age: pickNumber(raw.age, DEFAULT_AGE, 12, 70),
    height: pickNumber(raw.height, DEFAULT_HEIGHT, 120, 220),
    weight: pickNumber(raw.weight, DEFAULT_WEIGHT, 30, 200),
    programType: pickString(raw.programType, [
      "نظام غذائي + جدول تمارين + متابعة",
      "جدول تمارين + متابعة",
    ] as const),
  };
}

export function saveQuizAnswers(answers: QuizAnswers) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      ANSWERS_KEY,
      JSON.stringify({ version: QUIZ_STATE_VERSION, answers })
    );
  } catch {
    // Private mode / quota — answers simply aren't restorable.
  }
}

export function loadQuizAnswers(): QuizAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as StoredAnswers;
    // v1 wrote the answers object directly; v2 wraps it with a version.
    const payload = isRecord(parsed) && "answers" in parsed ? parsed.answers : parsed;
    return migrateAnswers(payload);
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Step progress                                                        */
/* ------------------------------------------------------------------ */

export interface QuizProgress {
  screen: "hero" | "quiz" | "result";
  stepIndex: number;
}

/** Persisted separately from the answers so a refresh lands on the same step. */
export function saveProgress(progress: QuizProgress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // ignored
  }
}

export function loadProgress(totalSteps: number): QuizProgress | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(PROGRESS_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<QuizProgress>;
    if (!isRecord(parsed)) return null;

    const screen =
      parsed.screen === "quiz" || parsed.screen === "result" ? parsed.screen : "hero";
    const stepIndex = pickNumber(parsed.stepIndex, 0, 0, Math.max(0, totalSteps - 1));
    return { screen, stepIndex };
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* Lead                                                                 */
/* ------------------------------------------------------------------ */

/** Arabic labels for the lead and the success page, which read the legacy names. */
export function trainingLocationLabel(value: TrainingLocation | ""): string {
  return value ? TRAINING_LOCATION_LABEL[value] : "";
}

export function trainingDaysLabel(value: TrainingDays | 0): string {
  return value ? TRAINING_DAYS_LABEL[value] : "";
}

export function buildLead(
  answers: QuizAnswers,
  recommendedPlan: string,
  selectedProductKey: ProductKey | "" = "",
  selectedProductTitle = "",
  selectedProductPrice = ""
): BasmaFitLead {
  return {
    goal: answers.goal,
    // Kept under the original keys so /success — and any dashboard already
    // reading `trainingPreference` / `weeklyDays` — keeps working unchanged.
    trainingPreference: trainingLocationLabel(answers.trainingLocation),
    level: answers.level,
    weeklyDays: trainingDaysLabel(answers.trainingDays),
    gender: answers.gender,
    age: answers.age,
    height: answers.height,
    weight: answers.weight,
    bmi: Number(calculateBmi(answers.height, answers.weight).toFixed(1)),
    programType: answers.programType,
    recommendedPlan,
    selectedProductKey,
    selectedProductTitle,
    selectedProductPrice,
    createdAt: new Date().toISOString(),
  };
}

export function saveLead(lead: BasmaFitLead) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LEAD_KEY, JSON.stringify(lead));
  // TODO: لاحقًا يمكن إرسال هذا الكائن إلى Supabase أو Google Sheets أو لوحة تحكم داخلية
}

export function loadLead(): BasmaFitLead | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(LEAD_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as BasmaFitLead;
  } catch {
    return null;
  }
}
