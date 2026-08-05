"use client";

import { WorkoutOptionCard } from "@/components/workout/WorkoutOptionCard";
import {
  WorkoutBackButton,
  WorkoutFrame,
  WorkoutPrimaryButton,
} from "@/components/workout/WorkoutButtons";
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
    <WorkoutFrame
      title={step.question}
      helper={step.helper}
      footer={
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <WorkoutPrimaryButton onClick={onNext}>
              {isLast ? "عرض النتيجة" : "متابعة"}
            </WorkoutPrimaryButton>
          </div>
          <WorkoutBackButton onClick={onBack} disabled={stepIndex === 0} />
        </div>
      }
    >
      <div className="mt-6">
        {step.kind === "choice" && (
          <div role="radiogroup" aria-label={step.question} className="flex flex-col gap-3">
            {step.options.map((option, index) => (
              <WorkoutOptionCard
                key={String(option.value)}
                option={option}
                index={index}
                selected={answers[step.key] === option.value}
                onClick={() => onChange(step.key, option.value)}
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
          <p className="animate-ob-rise mt-4 text-center text-[14px] font-semibold text-wk-pink-text">
            {error}
          </p>
        )}
      </div>
    </WorkoutFrame>
  );
}
