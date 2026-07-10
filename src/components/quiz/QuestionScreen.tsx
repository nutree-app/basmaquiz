import { BackButton, PrimaryButton } from "@/components/buttons";
import { Logo } from "@/components/Logo";
import { OptionCard } from "@/components/OptionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizStep } from "@/lib/quiz-steps";
import { QuizAnswers } from "@/lib/types";
import { WeightStepper } from "./WeightStepper";

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
  onChange: (key: keyof QuizAnswers, value: string | number) => void;
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
        {step.helper && (
          <p className="mt-2 text-sm leading-6 text-muted">{step.helper}</p>
        )}

        <div className="mt-7">
          {step.kind === "choice" ? (
            <div className="flex flex-col gap-3">
              {step.options.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  selected={answers[step.key] === option}
                  onClick={() => onChange(step.key, option)}
                />
              ))}
            </div>
          ) : (
            <WeightStepper
              currentWeight={answers.currentWeight}
              targetWeight={answers.targetWeight}
              onChangeCurrent={(value) => onChange("currentWeight", value)}
              onChangeTarget={(value) => onChange("targetWeight", value)}
            />
          )}

          {error && (
            <p className="mt-3 text-sm font-medium text-pink-strong animate-fade-in">{error}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <PrimaryButton onClick={onNext}>
          {isLast ? "عرض النتيجة" : "متابعة"}
        </PrimaryButton>
      </div>
    </div>
  );
}
