import { QuizAnswers } from "./types";
import {
  validateAge,
  validateEmail,
  validateHeight,
  validateInjuryDetails,
  validateName,
  validatePhone,
  validateRequiredChoice,
  validateWeight,
} from "./validation";

export type StepField =
  | { kind: "text"; key: "name" | "injuryDetails"; placeholder: string }
  | { kind: "tel"; key: "phone"; placeholder: string }
  | { kind: "email"; key: "email"; placeholder: string }
  | { kind: "number"; key: "age" | "weight" | "height"; placeholder: string; unit?: string }
  | { kind: "choice"; key: keyof QuizAnswers; options: string[] }
  | { kind: "visual-choice"; key: keyof QuizAnswers; options: { label: string; emoji: string }[] };

export interface QuizStep {
  id: string;
  question: string;
  helper?: string;
  field: StepField;
  validate: (answers: QuizAnswers) => string | null;
  showIf?: (answers: QuizAnswers) => boolean;
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "name",
    question: "وش اسمك؟",
    helper: "عشان نخاطبك باسمك في كل خطوة",
    field: { kind: "text", key: "name", placeholder: "اكتبي اسمك" },
    validate: (a) => validateName(a.name),
  },
  {
    id: "phone",
    question: "رقم الواتساب",
    helper: "بنرسل لك خطتك وتفاصيل التسجيل عليه",
    field: { kind: "tel", key: "phone", placeholder: "05xxxxxxxx" },
    validate: (a) => validatePhone(a.phone),
  },
  {
    id: "email",
    question: "الإيميل",
    helper: "لإرسال إيصال الاشتراك والمتابعة",
    field: { kind: "email", key: "email", placeholder: "example@email.com" },
    validate: (a) => validateEmail(a.email),
  },
  {
    id: "age",
    question: "كم عمرك؟",
    field: { kind: "number", key: "age", placeholder: "مثال: 25" },
    validate: (a) => validateAge(a.age),
  },
  {
    id: "weight",
    question: "تقريبًا كم وزنك؟",
    field: { kind: "number", key: "weight", placeholder: "مثال: 65", unit: "كجم" },
    validate: (a) => validateWeight(a.weight),
  },
  {
    id: "height",
    question: "كم طولك؟",
    field: { kind: "number", key: "height", placeholder: "مثال: 160", unit: "سم" },
    validate: (a) => validateHeight(a.height),
  },
  {
    id: "goal",
    question: "اختاري هدفك",
    helper: "اختاري اللي يناسبك",
    field: {
      kind: "choice",
      key: "goal",
      options: [
        "خسارة الدهون",
        "زيادة الوزن / تضخيم",
        "شد الجسم وتحسين الشكل",
        "لياقة وصحة عامة",
      ],
    },
    validate: (a) => validateRequiredChoice(a.goal),
  },
  {
    id: "workoutPlace",
    question: "وين تفضلين تتمرنين؟",
    helper: "وين تحبين تتمرنين؟",
    field: {
      kind: "choice",
      key: "workoutPlace",
      options: ["في المنزل", "في النادي"],
    },
    validate: (a) => validateRequiredChoice(a.workoutPlace),
  },
  {
    id: "level",
    question: "مستواك في التمرين؟",
    field: {
      kind: "choice",
      key: "level",
      options: ["مبتدئة", "متوسطة", "متقدمة"],
    },
    validate: (a) => validateRequiredChoice(a.level),
  },
  {
    id: "trainingDays",
    question: "كم يوم تقدرين تتمرنين بالأسبوع؟",
    field: {
      kind: "choice",
      key: "trainingDays",
      options: ["3 أيام", "4 أيام", "5 أيام", "6 أيام"],
    },
    validate: (a) => validateRequiredChoice(a.trainingDays),
  },
  {
    id: "injury",
    question: "هل عندك إصابة أو مشكلة صحية؟",
    field: {
      kind: "choice",
      key: "injury",
      options: ["لا", "نعم"],
    },
    validate: (a) => validateRequiredChoice(a.injury),
  },
  {
    id: "injuryDetails",
    question: "اكتبي الإصابة أو المشكلة الصحية",
    helper: "خطوة بسيطة تساعدنا نراعي حالتك عند بناء الخطة",
    field: {
      kind: "text",
      key: "injuryDetails",
      placeholder: "مثال: ألم في الركبة",
    },
    validate: (a) => validateInjuryDetails(a.injuryDetails),
    showIf: (a) => a.injury === "نعم",
  },
  {
    id: "pregnancyStatus",
    question: "هل انتِ حامل أو مرضعة؟",
    field: {
      kind: "choice",
      key: "pregnancyStatus",
      options: ["لا", "حامل", "مرضعة"],
    },
    validate: (a) => validateRequiredChoice(a.pregnancyStatus),
  },
  {
    id: "dietPreference",
    question: "أي نظام يناسبك أكثر؟",
    helper: "اختاري اللي يناسبك",
    field: {
      kind: "choice",
      key: "dietPreference",
      options: [
        "نظام عادي ومتوازن",
        "نظام عالي بروتين",
        "نظام نباتي",
        "صيام متقطع",
        "احتاج اقتراح من الكوتش",
      ],
    },
    validate: (a) => validateRequiredChoice(a.dietPreference),
  },
  {
    id: "bodyGoal",
    question: "أيش أقرب شكل لهدفك؟",
    helper: "ممتاز، بنحدد لك الأنسب",
    field: {
      kind: "visual-choice",
      key: "bodyGoal",
      options: [
        { label: "تنحيف وشد", emoji: "🔥" },
        { label: "تضخيم وبناء عضل", emoji: "💪" },
        { label: "شد البطن والخصر", emoji: "✨" },
        { label: "تحسين الجسم بشكل عام", emoji: "🌸" },
      ],
    },
    validate: (a) => validateRequiredChoice(a.bodyGoal),
  },
];

export function getVisibleSteps(answers: QuizAnswers): QuizStep[] {
  return QUIZ_STEPS.filter((step) => !step.showIf || step.showIf(answers));
}
