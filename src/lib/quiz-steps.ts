import { QuizAnswers } from "./types";
import { validateRequiredChoice } from "./validation";

export interface ChoiceStep {
  id: string;
  kind: "choice";
  key: keyof QuizAnswers;
  question: string;
  helper?: string;
  options: string[];
  icons?: Record<string, string>;
}

export interface WheelStep {
  id: string;
  kind: "wheel";
  key: "age";
  question: string;
  helper?: string;
  min: number;
  max: number;
  suffix: string;
}

export interface HeightWeightQuizStep {
  id: "heightWeight";
  kind: "height-weight";
  question: string;
  helper?: string;
}

export type QuizStep = ChoiceStep | WheelStep | HeightWeightQuizStep;

const LOCATION_ICONS = { "النادي": "🏋️‍♀️", "المنزل": "🏠", "المنزل والنادي معًا": "🔁" };

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "goal",
    kind: "choice",
    key: "goal",
    question: "ما هو هدفك؟",
    options: ["خسارة الوزن", "بناء العضلات", "المحافظة على الوزن", "تحسين اللياقة"],
  },
  {
    id: "trainingPreference",
    kind: "choice",
    key: "trainingPreference",
    question: "أين تفضلين التمرين؟",
    options: ["النادي", "المنزل", "المنزل والنادي معًا"],
    icons: LOCATION_ICONS,
  },
  {
    id: "level",
    kind: "choice",
    key: "level",
    question: "ما هو مستواك؟",
    options: ["مبتدئة", "متوسطة", "متقدمة"],
  },
  {
    id: "weeklyDays",
    kind: "choice",
    key: "weeklyDays",
    question: "كم مرة تستطيعين التمرين أسبوعياً؟",
    options: ["2 أيام", "3 أيام", "4 أيام", "5 أيام"],
  },
  {
    id: "gender",
    kind: "choice",
    key: "gender",
    question: "الجنس",
    options: ["أنثى", "ذكر"],
  },
  {
    id: "age",
    kind: "wheel",
    key: "age",
    question: "كم عمرك؟",
    min: 12,
    max: 70,
    suffix: "سنة",
  },
  {
    id: "heightWeight",
    kind: "height-weight",
    question: "كم طولك ووزنك؟",
    helper: "هذي المعلومة لحساب مؤشر كتلة الجسم وتخصيص خطتك.",
  },
  {
    id: "programType",
    kind: "choice",
    key: "programType",
    question: "وش حابه يكون برنامجك؟",
    options: ["نظام غذائي + جدول تمارين + متابعة", "جدول تمارين + متابعة"],
  },
];

export function validateStep(step: QuizStep, answers: QuizAnswers): string | null {
  if (step.kind !== "choice") return null;
  return validateRequiredChoice(answers[step.key] as string);
}
