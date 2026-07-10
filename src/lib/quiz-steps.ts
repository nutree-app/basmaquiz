import { QuizAnswers } from "./types";
import { validateRequiredChoice } from "./validation";

export interface QuizStep {
  id: string;
  key: keyof QuizAnswers;
  question: string;
  options: string[];
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "goal",
    key: "goal",
    question: "ما هو هدفك الأساسي؟",
    options: ["تنشيف وخسارة الدهون", "تضخيم وزيادة الكتلة العضلية"],
  },
  {
    id: "trainingLocation",
    key: "trainingLocation",
    question: "أين تفضلين ممارسة التمارين؟",
    options: ["النادي", "المنزل"],
  },
  {
    id: "level",
    key: "level",
    question: "ما هو مستواك الحالي؟",
    options: ["مبتدئة", "متوسطة", "متقدمة"],
  },
  {
    id: "trainingDays",
    key: "trainingDays",
    question: "كم يوم تقدرين تتمرنين في الأسبوع؟",
    options: ["3 أيام", "4 أيام", "5 أيام", "6 أيام"],
  },
  {
    id: "mainPreference",
    key: "mainPreference",
    question: "ما الشيء الأهم بالنسبة لك في البرنامج؟",
    options: [
      "جدول تمارين واضح",
      "نظام غذائي محسوب",
      "تمارين ونظام غذائي معًا",
      "متابعة وتحفيز مستمر",
    ],
  },
];

export function validateStep(step: QuizStep, answers: QuizAnswers): string | null {
  return validateRequiredChoice(answers[step.key]);
}
