import { BackButton, PrimaryButton } from "@/components/buttons";
import { Logo } from "@/components/Logo";
import { OptionCard, VisualOptionCard } from "@/components/OptionCard";
import { ProgressBar } from "@/components/ProgressBar";
import { TextField } from "@/components/TextField";
import { QuizStep } from "@/lib/quiz-steps";
import { QuizAnswers } from "@/lib/types";

export function QuestionScreen({
  step,
  stepKey,
  answers,
  error,
  stepIndex,
  totalSteps,
  onChange,
  onNext,
  onBack,
}: {
  step: QuizStep;
  stepKey: string;
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
    <div key={stepKey} className="animate-step-in flex flex-1 flex-col px-6 pb-8 pt-6">
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
          <QuestionField step={step} answers={answers} error={error} onChange={onChange} />
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

function QuestionField({
  step,
  answers,
  error,
  onChange,
}: {
  step: QuizStep;
  answers: QuizAnswers;
  error: string | null;
  onChange: (key: keyof QuizAnswers, value: string) => void;
}) {
  const { field } = step;

  if (field.kind === "text" || field.kind === "tel" || field.kind === "email") {
    return (
      <TextField
        type={field.kind === "text" ? "text" : field.kind}
        placeholder={field.placeholder}
        value={answers[field.key]}
        error={error}
        autoFocus
        onChange={(e) => onChange(field.key, e.target.value)}
      />
    );
  }

  if (field.kind === "number") {
    return (
      <TextField
        type="number"
        inputMode="numeric"
        placeholder={field.placeholder}
        unit={field.unit}
        value={answers[field.key]}
        error={error}
        autoFocus
        onChange={(e) => onChange(field.key, e.target.value)}
      />
    );
  }

  if (field.kind === "choice") {
    return (
      <div className="flex flex-col gap-3">
        {field.options.map((option) => (
          <OptionCard
            key={option}
            label={option}
            selected={answers[field.key] === option}
            onClick={() => onChange(field.key, option)}
          />
        ))}
        {error && (
          <p className="text-sm font-medium text-pink-strong animate-fade-in">{error}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {field.options.map((option) => (
          <VisualOptionCard
            key={option.label}
            label={option.label}
            emoji={option.emoji}
            selected={answers[field.key] === option.label}
            onClick={() => onChange(field.key, option.label)}
          />
        ))}
      </div>
      {error && (
        <p className="mt-3 text-sm font-medium text-pink-strong animate-fade-in">{error}</p>
      )}
    </div>
  );
}
