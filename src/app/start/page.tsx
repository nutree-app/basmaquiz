import { QuizFunnel } from "@/components/quiz/QuizFunnel";

// QuizFunnel now brings its own WorkoutShell — the dark, onboarding-style
// frame — so this route no longer wraps it in the shared AppShell. That shell
// is still used, unchanged, by /success and the guide.
export default function StartPage() {
  return <QuizFunnel />;
}
