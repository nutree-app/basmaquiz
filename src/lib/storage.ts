import {
  type BasmaFitLead,
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
 * Keys this flow owns. `basmafit_lead` is deliberately absent: it is the
 * post-purchase record /success reads, not onboarding progress, and wiping it
 * would blank that page for someone who opened the quiz in another tab.
 */
export const QUIZ_STATE_KEYS = [ANSWERS_KEY, PROGRESS_KEY] as const;

/**
 * Wipes any saved run so every visit begins at step 1.
 *
 * Called once when the funnel mounts. It also clears the older shapes those two
 * keys used to hold, which is why there is no migration path any more — nothing
 * is ever read back.
 */
export function resetQuizState() {
  if (typeof window === "undefined") return;
  for (const key of QUIZ_STATE_KEYS) {
    try {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    } catch {
      // Private mode — nothing was persisted to begin with.
    }
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
