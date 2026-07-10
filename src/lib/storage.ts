import { BasmaFitLead, ProductKey, QuizAnswers } from "./types";

const ANSWERS_KEY = "basmafit_quiz_answers";
const LEAD_KEY = "basmafit_lead";

export function saveQuizAnswers(answers: QuizAnswers) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ANSWERS_KEY, JSON.stringify(answers));
}

export function loadQuizAnswers(): QuizAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(ANSWERS_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizAnswers;
  } catch {
    return null;
  }
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
    trainingLocation: answers.trainingLocation,
    level: answers.level,
    trainingDays: answers.trainingDays,
    mainObstacle: answers.mainObstacle,
    programType: answers.programType,
    ageRange: answers.ageRange,
    currentWeight: answers.currentWeight,
    targetWeight: answers.targetWeight,
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
