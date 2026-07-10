import { BackButton, PrimaryButton } from "@/components/buttons";
import { OptionCard } from "@/components/OptionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { QuizStep } from "@/lib/quiz-steps";
import { QuizAnswers } from "@/lib/types";
import { HeightWeightStep } from "./HeightWeightStep";
import { WheelPicker } from "./WheelPicker";

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

      <div className="mt-10 flex-1">
        <h2 className="text-2xl font-black leading-tight text-foreground">
          {step.question}
        </h2>
        {step.helper && (
          <p className="mt-2 text-sm leading-6 text-muted">{step.helper}</p>
        )}

        <div className="mt-7">
          {step.kind === "choice" && (
            <div className="flex flex-col gap-3">
              {step.options.map((option) => (
                <OptionCard
                  key={option}
                  label={option}
                  icon={step.icons?.[option]}
                  selected={answers[step.key] === option}
                  onClick={() => onChange(step.key, option)}
                />
              ))}
            </div>
          )}

          {step.kind === "wheel" && (
            <WheelPicker
              values={Array.from({ length: step.max - step.min + 1 }, (_, i) => step.min + i)}
              value={answers[step.key]}
              onChange={(value) => onChange(step.key, value)}
              suffix={step.suffix}
            />
          )}

          {step.kind === "height-weight" && (
            <HeightWeightStep
              height={answers.height}
              weight={answers.weight}
              onChangeHeight={(value) => onChange("height", value)}
              onChangeWeight={(value) => onChange("weight", value)}
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
