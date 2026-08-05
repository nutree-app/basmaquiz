import { type QuizAnswers, TRAINING_DAYS_LABEL, TRAINING_DAYS_OPTIONS } from "./types";
import { validateRequiredChoice } from "./validation";

/** One selectable answer. */
export interface ChoiceOption {
  /** Canonical value stored in QuizAnswers. */
  value: string | number;
  label: string;
  helper?: string;
  /** Short text shown large inside the rounded tile — used by the training-days step. */
  badge?: string;
  /** Emoji shown inside the tile, in its own natural colours. */
  emoji?: string;
}

export interface ChoiceStep {
  id: string;
  kind: "choice";
  key: keyof QuizAnswers;
  question: string;
  helper?: string;
  options: ChoiceOption[];
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

const DAYS_HELPER: Record<number, string> = {
  2: "بداية خفيفة ومناسبة للانطلاق",
  3: "مثالي للمبتدئات",
  4: "توازن جيد بين النتيجة والوقت",
  5: "الخيار الأكثر شيوعا",
  6: "للرياضيات المتقدمات",
};

/** Plain-label options, for the steps that never had icons or helper text. */
function plain(labels: string[]): ChoiceOption[] {
  return labels.map((label) => ({ value: label, label }));
}

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: "goal",
    kind: "choice",
    key: "goal",
    question: "ما هو هدفك؟",
    options: plain([
      "خسارة الوزن",
      "بناء العضلات",
      "المحافظة على الوزن",
      "تحسين اللياقة",
    ]),
  },
  {
    id: "level",
    kind: "choice",
    key: "level",
    question: "ما هو مستواك؟",
    options: plain(["مبتدئة", "متوسطة", "متقدمة"]),
  },
  {
    id: "gender",
    kind: "choice",
    key: "gender",
    question: "الجنس",
    options: plain(["أنثى", "ذكر"]),
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
    options: plain([
      "نظام غذائي + جدول تمارين + متابعة",
      "جدول تمارين + متابعة",
    ]),
  },
  {
    id: "trainingLocation",
    kind: "choice",
    key: "trainingLocation",
    question: "وين مكان التمرين؟",
    helper: "سنخصص التمارين حسب المكان والأدوات المتاحة لديك.",
    options: [
      {
        value: "home",
        label: "المنزل",
        helper: "أتمرن في البيت بأدوات بسيطة أو بدون أدوات",
        emoji: "\u{1F3E0}",
      },
      {
        value: "gym",
        label: "النادي الرياضي",
        helper: "أتمرن في الجيم مع المعدات الكاملة",
        emoji: "\u{1F3CB}\u{1F3FB}\u{200D}\u{2640}\u{FE0F}",
      },
    ],
  },
  {
    id: "trainingDays",
    kind: "choice",
    key: "trainingDays",
    question: "كم يوم تتمرن بالأسبوع؟",
    helper: "سنبني خطتك التدريبية بناء على جدولك.",
    options: TRAINING_DAYS_OPTIONS.map((days) => ({
      value: days,
      label: TRAINING_DAYS_LABEL[days],
      helper: DAYS_HELPER[days],
      // The numeral alone, shown large inside the tile.
      badge: String(days),
    })),
  },
];

export const TOTAL_STEPS = QUIZ_STEPS.length;

/** Step ids in order — the vocabulary accepted by the ?step= deep link. */
export const STEP_IDS = QUIZ_STEPS.map((step) => step.id);

export function validateStep(step: QuizStep, answers: QuizAnswers): string | null {
  if (step.kind !== "choice") return null;
  const value = answers[step.key];
  // trainingDays holds 0 until answered; every other choice holds "".
  return validateRequiredChoice(value === 0 ? "" : String(value ?? ""));
}
