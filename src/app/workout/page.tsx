import type { Metadata } from "next";
import WorkoutOnboardingFlow from "@/components/workout-onboarding/WorkoutOnboardingFlow";

export const metadata: Metadata = {
  title: "خطة التمرين | بسمة فت",
  description:
    "جاوبي على أسئلة بسيطة ونجهز لك خطة تمرين وتغذية مناسبة لهدفك، مكان تمرينك، وعدد أيامك في الأسبوع.",
};

/**
 * The 20-step Basmafit workout onboarding. /start keeps the original quiz
 * funnel unchanged — only this route was rebuilt.
 */
export default function WorkoutPage() {
  return <WorkoutOnboardingFlow />;
}
