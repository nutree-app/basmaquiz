"use client";

import { Sparkles } from "../icons";
import {
  WATER_MAX_ML,
  WATER_MIN_ML,
  WATER_STEP_ML,
  clamp,
} from "@/lib/onboarding/calculations";
import { waterStep } from "@/lib/onboarding/content";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import StepperButton from "../StepperButton";
import WaterDial from "../WaterDial";
import type { StepProps } from "../stepProps";

const BENEFIT_TONE: Record<string, string> = {
  flame: "bg-[#3A2410] text-ob-amber",
  energy: "bg-[#3A3410] text-[#FFD60A]",
  goal: "bg-ob-blue-deep text-ob-blue-text",
};

/** Screen 14 — the daily hydration goal, seeded from body weight and activity. */
export default function WaterStep({ patch, plan, onNext, onBack }: StepProps) {
  const setWater = (next: number) => {
    patch({ waterMl: clamp(Math.round(next / WATER_STEP_ML) * WATER_STEP_ML, WATER_MIN_ML, WATER_MAX_ML) });
  };

  return (
    <StepFrame
      title={waterStep.title}
      subtitle={waterStep.subtitle}
      footer={<StepFooter onNext={onNext} onBack={onBack} />}
    >
      <ul className="mt-7 flex flex-col gap-3">
        {waterStep.benefits.map((benefit, index) => (
          <li
            key={benefit.tone}
            style={{ animationDelay: `${80 + index * 70}ms` }}
            className="animate-ob-rise flex items-center gap-3"
          >
            <span
              aria-hidden
              className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-[18px] ${BENEFIT_TONE[benefit.tone]}`}
            >
              {benefit.emoji}
            </span>
            <span className="text-[15px] font-semibold text-white">{benefit.text}</span>
          </li>
        ))}
      </ul>

      {/* Minus left, plus right — a numeric control, laid out like the app's. */}
      <div dir="ltr" className="mt-9 flex items-center justify-center gap-4">
        <StepperButton
          direction="decrease"
          onClick={() => setWater(plan.waterMl - WATER_STEP_ML)}
          disabled={plan.waterMl <= WATER_MIN_ML}
          label={`-${WATER_STEP_ML} ml`}
        />

        <WaterDial ml={plan.waterMl} />

        <StepperButton
          direction="increase"
          onClick={() => setWater(plan.waterMl + WATER_STEP_ML)}
          disabled={plan.waterMl >= WATER_MAX_ML}
          label={`+${WATER_STEP_ML} ml`}
        />
      </div>

      <button
        type="button"
        onClick={() => patch({ waterMl: null })}
        className="mx-auto mt-7 flex items-center gap-1.5 rounded-full bg-ob-blue-deep px-4 py-2 text-[13.5px] font-bold text-ob-blue-text transition-opacity duration-200 active:opacity-70"
      >
        <Sparkles className="h-4 w-4" strokeWidth={2.4} />
        {waterStep.recommended(String(plan.recommendedWaterMl))}
      </button>
    </StepFrame>
  );
}
