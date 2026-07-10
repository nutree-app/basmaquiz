import { BackButton, PrimaryButton } from "@/components/buttons";
import { Logo } from "@/components/Logo";
import { OptionCard } from "@/components/OptionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizStep } from "@/lib/quiz-steps";
import { QuizAnswers } from "@/lib/types";

export function QuestionScreen({
  step,
  answers,
  error,
  stepIndex,
  totalSteps,
  onChange,
  onNext,
  onBack,
}: {
  step: QuizStep;
  answers: QuizAnswers;
  error: string | null;
  stepIndex: number;
  totalSteps: number;
  onChange: (key: keyof QuizAnswers, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const isLast = stepIndex === totalSteps - 1;

  return (
    <div key={step.id} className="animate-step-in flex flex-1 flex-col px-6 pb-8 pt-6">
      <div className="flex items-center gap-3">
        <BackButton onClick={onBack} disabled={stepIndex === 0} />
        <div className="flex-1">
          <ProgressBar current={stepIndex} total={totalSteps} />
        </div>
      </div>

      <div className="mt-2 flex justify-center">
        <Logo size="sm" />
      </div>

      <div className="mt-8 flex-1">
        <h2 className="text-2xl font-black leading-tight text-foreground">
          {step.question}
        </h2>

        <div className="mt-7 flex flex-col gap-3">
          {step.options.map((option) => (
            <OptionCard
              key={option}
              label={option}
              selected={answers[step.key] === option}
              onClick={() => onChange(step.key, option)}
            />
          ))}
          {error && (
            <p className="text-sm font-medium text-pink-strong animate-fade-in">{error}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={onNext}>
          {isLast ? "عرض النتيجة" : "التالي"}
        </PrimaryButton>
      </div>
    </div>
  );
}
