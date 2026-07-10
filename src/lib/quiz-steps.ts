import { QuizAnswers } from "./types";
import { validateRequiredChoice } from "./validation";

export interface ChoiceStep {
  id: string;
  kind: "choice";
  key: keyof QuizAnswers;
  question: string;
  helper?: string;
  options: string[];
}

export interface WeightStep {
  id: "weight";
  kind: "weight";
  question: string;
  helper?: string;
}

export type QuizStep = ChoiceStep | WeightStep;

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "goal",
    kind: "choice",
    key: "goal",
    question: "ما هو هدفك الأساسي؟",
    options: ["تنشيف وخسارة الدهون", "تضخيم وزيادة الكتلة العضلية"],
  },
  {
    id: "trainingLocation",
    kind: "choice",
    key: "trainingLocation",
    question: "أين تفضلين ممارسة التمارين؟",
    options: ["النادي", "المنزل", "النادي والمنزل"],
  },
  {
    id: "level",
    kind: "choice",
    key: "level",
    question: "ما هو مستواك الحالي في التمارين؟",
    helper: "نستخدم إجابتك لاختيار مستوى التمارين المناسب لك.",
    options: ["مبتدئة", "متوسطة", "متقدمة"],
  },
  {
    id: "trainingDays",
    kind: "choice",
    key: "trainingDays",
    question: "كم يوم تقدرين تتمرنين في الأسبوع؟",
    options: ["يومين", "3 أيام", "4 أيام", "5 أيام أو أكثر"],
  },
  {
    id: "mainObstacle",
    kind: "choice",
    key: "mainObstacle",
    question: "وش أكثر شيء يعيق وصولك لهدفك؟",
    options: [
      "ما أعرف وش التمارين المناسبة",
      "ما أعرف كيف أرتب أكلي",
      "أبدأ وأوقف بسرعة",
      "أحتاج متابعة وتحفيز",
      "أحتاج خطة واضحة ومتكاملة",
    ],
  },
  {
    id: "programType",
    kind: "choice",
    key: "programType",
    question: "وش حابة يكون برنامجك؟",
    helper: "اختاري الشيء اللي تحتاجينه فعلا في خطتك.",
    options: ["نظام غذائي + جداول تمارين + متابعة", "جداول تمارين فقط"],
  },
  {
    id: "ageRange",
    kind: "choice",
    key: "ageRange",
    question: "كم عمرك؟",
    options: ["18-24", "25-31", "32-38", "39-45", "46+"],
  },
  {
    id: "weight",
    kind: "weight",
    question: "وش وزنك الحالي ووزنك المستهدف؟",
    helper: "هذي المعلومة لتخصيص تجربتك فقط.",
  },
];

export function validateStep(step: QuizStep, answers: QuizAnswers): string | null {
  if (step.kind === "weight") return null;
  return validateRequiredChoice(answers[step.key] as string);
}
