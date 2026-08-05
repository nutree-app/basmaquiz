"use client";

import {
  MAX_WEIGHT_KG,
  MIN_WEIGHT_KG,
  clamp,
  resolveTargetWeight,
  roundHalf,
} from "@/lib/onboarding/calculations";
import { targetStep } from "@/lib/onboarding/content";
import { formatDecimal, kgToLb } from "@/lib/onboarding/units";
import RulerPicker from "../RulerPicker";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import StepperButton from "../StepperButton";
import type { StepProps } from "../stepProps";

const STEP_KG = 0.5;

/**
 * Screen 6 — the target weight ruler.
 *
 * The ruler spans a window around the current weight rather than the whole
 * 35–200 kg scale, so a realistic target is a short flick away instead of a
 * long scroll.
 */
export default function TargetWeightStep({ state, patch, onNext, onBack }: StepProps) {
  const current = state.weightKg;
  const target = resolveTargetWeight(state);
  const imperial = state.units === "imperial";

  const min = Math.max(MIN_WEIGHT_KG, roundHalf(current * 0.5));
  const max = Math.min(MAX_WEIGHT_KG, roundHalf(current * 1.3));

  const setTarget = (next: number) => {
    patch({ targetWeightKg: clamp(roundHalf(next), min, max) });
  };

  const delta = target - current;
  const caption =
    Math.abs(delta) < 0.05
      ? targetStep.same
      : delta < 0
        ? targetStep.lose(formatDecimal(Math.abs(delta)))
        : targetStep.gain(formatDecimal(Math.abs(delta)));

  // Maintaining is a valid answer with no change to make; every other goal
  // needs the user to actually place the ruler before continuing.
  const canContinue = state.goal === "maintain" || state.targetWeightKg !== null;

  return (
    <StepFrame
      title={targetStep.title}
      footer={<StepFooter onNext={onNext} nextDisabled={!canContinue} onBack={onBack} />}
    >
      {/* Title stays at the top; the control sits in the middle of what's left. */}
      <div className="flex flex-1 flex-col items-center justify-center py-10">
        {/* Numeric control: laid out left-to-right, like the app's stepper. */}
        <div dir="ltr" className="flex items-center gap-7">
          <StepperButton
            direction="decrease"
            onClick={() => setTarget(target - STEP_KG)}
            disabled={target <= min}
            label={`-${STEP_KG} kg`}
          />

          <span className="min-w-[150px] text-center text-[44px] font-extrabold leading-none text-white tabular-nums">
            {imperial
              ? `${Math.round(kgToLb(target))} lb`
              : `${formatDecimal(target)} kg`}
          </span>

          <StepperButton
            direction="increase"
            onClick={() => setTarget(target + STEP_KG)}
            disabled={target >= max}
            label={`+${STEP_KG} kg`}
          />
        </div>

        <div className="mt-9 w-full">
          <RulerPicker
            min={min}
            max={max}
            step={STEP_KG}
            value={target}
            onChange={setTarget}
            label={targetStep.title}
          />
        </div>

        <p className="mt-7 text-center text-[14px] font-medium text-ob-text-dim">{caption}</p>
      </div>
    </StepFrame>
  );
}
