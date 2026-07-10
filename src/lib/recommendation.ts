import { Goal, QuizAnswers, RecommendedPlan, WorkoutPlace } from "./types";

const HOME_OR_CLUB_GOALS: Goal[] = ["خسارة الدهون", "شد الجسم وتحسين الشكل"];

export function getRecommendedPlan(
  goal: Goal | "",
  workoutPlace: WorkoutPlace | ""
): RecommendedPlan {
  if (goal === "لياقة وصحة عامة") {
    return "تحسين الجسم واللياقة";
  }

  if (goal && HOME_OR_CLUB_GOALS.includes(goal)) {
    return workoutPlace === "في النادي" ? "تنشيف نادي" : "تنشيف منزلي";
  }

  if (goal === "زيادة الوزن / تضخيم") {
    return workoutPlace === "في النادي" ? "تضخيم نادي" : "تضخيم منزلي";
  }

  return "تحسين الجسم واللياقة";
}

export function needsHealthNotice(answers: QuizAnswers): boolean {
  return (
    answers.injury === "نعم" ||
    answers.pregnancyStatus === "حامل" ||
    answers.pregnancyStatus === "مرضعة"
  );
}
