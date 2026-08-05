import type { Metadata } from "next";
import { QuizFunnel } from "@/components/quiz/QuizFunnel";

export const metadata: Metadata = {
  title: "خطة التمرين | بسمة فت",
  description:
    "جاوبي على أسئلة بسيطة ونجهز لك خطة تمرين وتغذية مناسبة لهدفك، مكان تمرينك، وعدد أيامك في الأسبوع.",
};

/**
 * /workout and /start render the same flow — one funnel, one set of answers,
 * one localStorage key — so a visitor can arrive at either URL and continue
 * where they left off.
 */
export default function WorkoutPage() {
  return <QuizFunnel />;
}
