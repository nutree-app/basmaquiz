"use client";

import {
  MAX_HEIGHT_CM,
  MAX_WEIGHT_KG,
  MIN_HEIGHT_CM,
  MIN_WEIGHT_KG,
} from "@/lib/onboarding/calculations";
import { body } from "@/lib/onboarding/content";
import type { UnitSystem } from "@/lib/onboarding/types";
import {
  cmToInches,
  formatFeetInches,
  inchesToCm,
  kgToLb,
  lbToKg,
} from "@/lib/onboarding/units";
import BmiMeter from "../BmiMeter";
import SegmentedControl from "../SegmentedControl";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import WheelPicker from "../WheelPicker";
import type { StepProps } from "../stepProps";

function range(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
}

const HEIGHT_CM = range(MIN_HEIGHT_CM, MAX_HEIGHT_CM);
const HEIGHT_IN = range(Math.round(cmToInches(MIN_HEIGHT_CM)), Math.round(cmToInches(MAX_HEIGHT_CM)));
const WEIGHT_KG = range(MIN_WEIGHT_KG, MAX_WEIGHT_KG);
const WEIGHT_LB = range(Math.round(kgToLb(MIN_WEIGHT_KG)), Math.round(kgToLb(MAX_WEIGHT_KG)));

const UNIT_OPTIONS: { value: UnitSystem; label: string }[] = [
  { value: "metric", label: body.metric },
  { value: "imperial", label: body.imperial },
];

/**
 * Screen 3 — height and weight wheels with a live BMI readout.
 *
 * Metric is always what gets stored; the imperial wheels convert on the way
 * in and out. Switching units remounts both wheels (via `key`) so each one
 * re-seeds its scroll position against the new value set.
 */
export default function BodyStep({ state, patch, plan, onNext, onBack }: StepProps) {
  const imperial = state.units === "imperial";

  return (
    <StepFrame
      title={body.title}
      subtitle={body.subtitle}
      footer={<StepFooter onNext={onNext} onBack={onBack} />}
    >
      <div className="mt-6">
        <SegmentedControl
          options={UNIT_OPTIONS}
          value={state.units}
          onChange={(units) => patch({ units })}
          label={`${body.metric} / ${body.imperial}`}
        />
      </div>

      {/* Height first so it lands on the right in the RTL row, as in the app. */}
      <div className="mt-8 grid grid-cols-2 gap-2">
        <div>
          <p className="text-center text-[15px] font-semibold text-ob-text-dim">
            {body.heightLabel}
          </p>
          <div className="mt-2">
            {imperial ? (
              <WheelPicker
                key="height-imperial"
                values={HEIGHT_IN}
                value={Math.round(cmToInches(state.heightCm))}
                onChange={(inches) => patch({ heightCm: Math.round(inchesToCm(inches)) })}
                format={(inches) => formatFeetInches(inchesToCm(inches))}
                label={body.heightLabel}
              />
            ) : (
              <WheelPicker
                key="height-metric"
                values={HEIGHT_CM}
                value={Math.round(state.heightCm)}
                onChange={(heightCm) => patch({ heightCm })}
                format={(cm) => `${cm} cm`}
                label={body.heightLabel}
              />
            )}
          </div>
        </div>

        <div>
          <p className="text-center text-[15px] font-semibold text-ob-text-dim">
            {body.weightLabel}
          </p>
          <div className="mt-2">
            {imperial ? (
              <WheelPicker
                key="weight-imperial"
                values={WEIGHT_LB}
                value={Math.round(kgToLb(state.weightKg))}
                onChange={(lb) => patch({ weightKg: Number(lbToKg(lb).toFixed(1)) })}
                format={(lb) => `${lb} lb`}
                label={body.weightLabel}
              />
            ) : (
              <WheelPicker
                key="weight-metric"
                values={WEIGHT_KG}
                value={Math.round(state.weightKg)}
                onChange={(weightKg) => patch({ weightKg })}
                format={(kg) => `${kg} kg`}
                label={body.weightLabel}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8">
        <BmiMeter bmi={plan.bmi} category={plan.bmiCategory} />
      </div>
    </StepFrame>
  );
}
