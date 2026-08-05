import type { Metadata } from "next";
import { QuizFunnel } from "@/components/quiz/QuizFunnel";

export const metadata: Metadata = {
  title: "خطة التمرين | بسمة فت",
  description:
    "جاوبي على أسئلة بسيطة ونجهز لك خطة تمرين وتغذية مناسبة لهدفك، مكان تمرينك، وعدد أيامك في الأسبوع.",
};

/**
 * /workout and /start render the same flow — one funnel, one set of answers.
 * Nothing is persisted: arriving at either URL always begins a new run at step
 * 1, so a returning visitor never lands on an old answer set or result.
 */
export default function WorkoutPage() {
  return <QuizFunnel />;
}
