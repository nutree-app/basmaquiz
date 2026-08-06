import { type Gender, type Goal, type Level } from "./types";

/**
 * Where the user trains — drives the exercise vocabulary. Declared here rather
 * than imported so the shared exercise tables stay independent of any one
 * flow's answer shape; /workout has its own identical union.
 */
export type TrainingLocation = "home" | "gym";

/** Training days per week. The generated split always has exactly this many days. */
export type TrainingDays = 2 | 3 | 4 | 5 | 6;

/** The answers this builder actually reads — a structural subset, not a whole flow's state. */
export interface WorkoutPlanInput {
  trainingLocation: TrainingLocation | "" | null;
  trainingDays: TrainingDays | 0 | null;
  level?: Level | "";
  goal?: Goal | "";
  gender?: Gender | "";
}

/**
 * Turns the quiz answers into a concrete weekly training plan.
 *
 * Two answers drive it directly:
 *  - `trainingLocation` picks the exercise vocabulary. Home users only ever see
 *    bodyweight / band / light-dumbbell movements; gym users get barbell,
 *    cable and machine work.
 *  - `trainingDays` fixes the length of the schedule. The split is chosen per
 *    day-count, so someone who answered 3 أيام can never be handed a 5-day
 *    week — the array simply has three entries.
 *
 * Goal sets the volume prescription, level sets how many movements per session,
 * and gender nudges the lower-body emphasis (glute-led for أنثى).
 */

export type FocusKey = "push" | "pull" | "lower" | "upper" | "core" | "cardio" | "fullBody";

export const FOCUS_TITLE: Record<FocusKey, string> = {
  push: "دفع — صدر وكتف وترايسبس",
  pull: "سحب — ظهر وبايسبس",
  lower: "الجزء السفلي — أرجل ومؤخرة",
  upper: "الجزء العلوي كامل",
  core: "وسط الجسم والثبات",
  cardio: "كارديو وحرق",
  fullBody: "الجسم كامل",
};

/** Ordered pools. The first entries are the compound lifts, so trimming keeps them. */
export const EXERCISES: Record<TrainingLocation, Record<FocusKey, string[]>> = {
  gym: {
    push: [
      "ضغط بنش بالبار",
      "ضغط كتف بالدمبل",
      "تفتيح صدر بالكيبل",
      "ضغط صدر مائل بالدمبل",
      "تمديد ترايسبس بالكيبل",
      "رفرفة جانبية بالدمبل",
    ],
    pull: [
      "سحب أرضي بالكيبل",
      "سحب علوي (لات بول داون)",
      "تجديف بالبار",
      "سحب وجه بالكيبل",
      "مرجحة بايسبس بالبار",
      "بايسبس بالدمبل بالتناوب",
    ],
    lower: [
      "سكوات بالبار",
      "رفعة ميتة رومانية",
      "ضغط أرجل (Leg Press)",
      "لانجز بالدمبل",
      "تمديد أرجل بالماكينة",
      "سمانة واقفة بالماكينة",
    ],
    upper: [
      "ضغط صدر بالدمبل",
      "سحب علوي (لات بول داون)",
      "ضغط كتف بالماكينة",
      "تجديف بالكيبل",
      "بايسبس بالبار",
      "ترايسبس بالحبل",
    ],
    core: [
      "بلانك",
      "كرنش على الكيبل",
      "رفع أرجل معلقة",
      "بلانك جانبي",
      "تويست روسي بالقرص",
      "عجلة البطن",
    ],
    cardio: [
      "مشي مائل على السير",
      "دراجة ثابتة",
      "جهاز الإليبتكال",
      "تجديف على جهاز الروينج",
      "درج متحرك",
      "نط الحبل",
    ],
    fullBody: [
      "سكوات بالبار",
      "ضغط صدر بالدمبل",
      "سحب أرضي بالكيبل",
      "رفعة ميتة رومانية",
      "ضغط كتف بالدمبل",
      "بلانك",
    ],
  },
  home: {
    push: [
      "تمرين الضغط (Push-ups)",
      "ضغط بميل للأعلى على الكنب",
      "ضغط كتف بحبل المقاومة",
      "غطس ترايسبس على الكرسي",
      "ضغط ماسي للترايسبس",
      "رفرفة جانبية بالمقاومة",
    ],
    pull: [
      "تجديف بحبل المقاومة",
      "سحب أمامي بالمقاومة",
      "سوبرمان",
      "تجديف بذراع واحدة بالمقاومة",
      "بايسبس بحبل المقاومة",
      "سحب وجه بالمقاومة",
    ],
    lower: [
      "سكوات بوزن الجسم",
      "لانجز في المكان",
      "جسر المؤخرة",
      "سكوات بلغاري على الكرسي",
      "رفع السمانة على الدرجة",
      "ركلة خلفية للمؤخرة",
    ],
    upper: [
      "تمرين الضغط (Push-ups)",
      "تجديف بحبل المقاومة",
      "ضغط كتف بالمقاومة",
      "سوبرمان",
      "غطس ترايسبس على الكرسي",
      "بايسبس بالمقاومة",
    ],
    core: [
      "بلانك",
      "كرنش",
      "تسلق الجبل (Mountain Climbers)",
      "رفع الأرجل على الأرض",
      "بلانك جانبي",
      "تويست روسي بوزن الجسم",
    ],
    cardio: [
      "نط الحبل",
      "جري في المكان",
      "بربي",
      "قفز الجاك",
      "تسلق الجبل (Mountain Climbers)",
      "خطوات جانبية سريعة",
    ],
    fullBody: [
      "سكوات بوزن الجسم",
      "تمرين الضغط (Push-ups)",
      "لانجز في المكان",
      "تجديف بحبل المقاومة",
      "بربي",
      "بلانك",
    ],
  },
};

/**
 * One split per allowed day-count. The length of each array *is* the number of
 * training days, which is what guarantees a 3-day answer never yields 5 days.
 */
export const SPLITS: Record<TrainingDays, FocusKey[]> = {
  2: ["upper", "lower"],
  3: ["upper", "lower", "fullBody"],
  4: ["push", "pull", "lower", "upper"],
  5: ["push", "pull", "lower", "upper", "core"],
  6: ["push", "pull", "lower", "upper", "core", "cardio"],
};

export const SPLIT_NAME: Record<TrainingDays, string> = {
  2: "تقسيمة يومين — علوي / سفلي",
  3: "تقسيمة 3 أيام — علوي / سفلي / جسم كامل",
  4: "تقسيمة 4 أيام — دفع / سحب / أرجل / علوي",
  5: "تقسيمة 5 أيام — دفع / سحب / أرجل / علوي / وسط",
  6: "تقسيمة 6 أيام — تغطية كاملة مع يوم كارديو",
};

/** Sets and reps guidance, driven by the goal. */
const INTENSITY: Record<Goal, string> = {
  "خسارة الوزن": "٣ مجموعات × ١٢-١٥ تكرار، راحة ٤٥ ثانية",
  "بناء العضلات": "٤ مجموعات × ٨-١٢ تكرار، راحة ٩٠ ثانية",
  "المحافظة على الوزن": "٣ مجموعات × ١٠-١٢ تكرار، راحة ٦٠ ثانية",
  "تحسين اللياقة": "٣ مجموعات × ١٥ تكرار، راحة ٣٠-٤٥ ثانية",
};

/** How many movements per session — more as the level rises. */
const EXERCISES_PER_DAY: Record<Level, number> = {
  "مبتدئة": 4,
  "متوسطة": 5,
  "متقدمة": 6,
};

export interface WorkoutDay {
  /** 1-based day number within the week. */
  day: number;
  title: string;
  exercises: string[];
}

export interface WorkoutPlan {
  location: TrainingLocation;
  locationLabel: string;
  days: TrainingDays;
  splitName: string;
  intensity: string;
  schedule: WorkoutDay[];
  equipmentNote: string;
}

const EQUIPMENT_NOTE: Record<TrainingLocation, string> = {
  gym: "التمارين مبنية على معدات النادي: بار، دمبل، كيبل وأجهزة.",
  home: "كل التمارين تنفذ في البيت بوزن الجسم أو بحبل مقاومة ودمبل خفيف.",
};

const LOCATION_LABEL: Record<TrainingLocation, string> = {
  gym: "النادي الرياضي",
  home: "المنزل",
};

/** Glute-dominant movements, floated to the front of leg day for أنثى. */
const GLUTE_FIRST: Record<TrainingLocation, string[]> = {
  gym: ["رفعة ميتة رومانية", "لانجز بالدمبل"],
  home: ["جسر المؤخرة", "ركلة خلفية للمؤخرة"],
};

function orderForGender(
  exercises: string[],
  focus: FocusKey,
  location: TrainingLocation,
  gender: Gender | ""
): string[] {
  if (gender !== "أنثى" || (focus !== "lower" && focus !== "fullBody")) return exercises;

  const preferred = GLUTE_FIRST[location];
  const lead = exercises.filter((e) => preferred.includes(e));
  if (lead.length === 0) return exercises;
  return [...lead, ...exercises.filter((e) => !preferred.includes(e))];
}

/**
 * Builds the weekly plan. Returns null only when the two driving answers are
 * missing, so callers can fall back rather than render an empty schedule.
 */
export function buildWorkoutPlan(answers: WorkoutPlanInput): WorkoutPlan | null {
  const { trainingLocation, trainingDays } = answers;
  if (!trainingLocation || !trainingDays) return null;

  const pool = EXERCISES[trainingLocation];
  const perDay = EXERCISES_PER_DAY[answers.level || "مبتدئة"] ?? 4;
  const goal: Goal = answers.goal || "تحسين اللياقة";

  const schedule = SPLITS[trainingDays].map((focus, index) => ({
    day: index + 1,
    title: FOCUS_TITLE[focus],
    exercises: orderForGender(
      pool[focus].slice(0, perDay),
      focus,
      trainingLocation,
      answers.gender ?? ""
    ),
  }));

  return {
    location: trainingLocation,
    locationLabel: LOCATION_LABEL[trainingLocation],
    days: trainingDays,
    splitName: SPLIT_NAME[trainingDays],
    intensity: INTENSITY[goal],
    schedule,
    equipmentNote: EQUIPMENT_NOTE[trainingLocation],
  };
}
