"use client";

import { MAX_AGE, MIN_AGE } from "@/lib/onboarding/calculations";
import { genderChoices, personal } from "@/lib/onboarding/content";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import WheelPicker from "../WheelPicker";
import type { StepProps } from "../stepProps";

const AGE_VALUES = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

/** Screen 2 — gender tiles plus the age wheel, on one screen as in the app. */
export default function PersonalStep({ state, patch, onNext, onBack }: StepProps) {
  return (
    <StepFrame
      title={personal.title}
      subtitle={personal.subtitle}
      footer={<StepFooter onNext={onNext} nextDisabled={!state.gender} onBack={onBack} />}
    >
      <div className="mt-7 grid grid-cols-2 gap-3.5">
        {genderChoices.map((choice, index) => {
          const selected = state.gender === choice.value;

          return (
            <button
              key={choice.value}
              type="button"
              aria-pressed={selected}
              onClick={() => patch({ gender: choice.value })}
              style={{ animationDelay: `${80 + index * 70}ms` }}
              className={`animate-ob-rise flex flex-col items-center gap-2 rounded-2xl border py-6 transition-all duration-200 active:scale-[0.97] ${
                selected
                  ? "border-[var(--ob-accent-border)] bg-[var(--ob-accent-surface)] shadow-[0_0_0_1px_var(--ob-accent-ring),0_14px_34px_-18px_var(--ob-accent-glow-strong)]"
                  : "border-white/[0.07] bg-ob-card hover:border-white/15"
              }`}
            >
              <span aria-hidden className="text-[38px] leading-none">
                {choice.emoji}
              </span>
              <span className="text-[16px] font-bold text-white">{choice.title}</span>
            </button>
          );
        })}
      </div>

      <h2 className="mt-9 text-[19px] font-extrabold text-white">{personal.ageLabel}</h2>

      <div className="mt-1">
        <WheelPicker
          values={AGE_VALUES}
          value={state.age}
          onChange={(age) => patch({ age })}
          format={String}
          label={personal.ageLabel}
        />
      </div>
    </StepFrame>
  );
}
