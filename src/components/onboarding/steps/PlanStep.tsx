"use client";

import { useState } from "react";
import { Check, Pencil, RotateCcw } from "../icons";
import { planStep } from "@/lib/onboarding/content";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import StepperButton from "../StepperButton";
import { useCountUp } from "../useCountUp";
import type { StepProps } from "../stepProps";

const CALORIE_STEP = 10;
const MACRO_STEP = 5;
const MIN_CALORIES = 800;
const MAX_CALORIES = 6000;

/**
 * Screen 15 — the payoff. Everything the user answered, resolved into one
 * calorie target and three macro figures.
 *
 * The pencil reveals steppers rather than opening a separate editor, so the
 * numbers stay in place while they are adjusted. Nudging calories re-splits
 * the macros (see buildPlan); touching a macro pins that one.
 */
export default function PlanStep({ patch, plan, onNext, onBack }: StepProps) {
  const [editing, setEditing] = useState(false);
  const calories = useCountUp(plan.calories);

  const resetToRecommended = () => {
    patch({
      customCalories: null,
      customProteinG: null,
      customFatG: null,
      customCarbsG: null,
    });
  };

  const nudgeCalories = (delta: number) => {
    patch({
      customCalories: Math.min(
        MAX_CALORIES,
        Math.max(MIN_CALORIES, plan.calories + delta)
      ),
    });
  };

  return (
    <StepFrame
      title={planStep.title}
      subtitle={planStep.subtitle}
      footer={<StepFooter onNext={onNext} onBack={onBack} />}
    >
      {/* Calorie target */}
      <div className="animate-ob-rise mt-6 rounded-[22px] border border-ob-amber/25 bg-linear-to-bl from-[#3B2A0F] via-[#2C2010] to-[#1E1809] p-4">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="grid h-[58px] w-[58px] shrink-0 place-items-center rounded-full border-2 border-ob-amber/60 bg-black/25 text-[24px]"
          >
            🔥
          </span>

          <div className="min-w-0 flex-1 text-center">
            <p className="text-[36px] font-extrabold leading-none text-[#FF9F1C] tabular-nums" dir="ltr">
              {calories}
            </p>
            <p className="mt-1.5 text-[13px] font-semibold text-white/70">
              {planStep.caloriesLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setEditing((open) => !open)}
            aria-pressed={editing}
            aria-label={planStep.editHint}
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-black/30 text-white/80 transition-colors duration-200 hover:text-white"
          >
            {editing ? (
              <Check className="h-[18px] w-[18px]" strokeWidth={2.6} />
            ) : (
              <Pencil className="h-[18px] w-[18px]" strokeWidth={2.2} />
            )}
          </button>
        </div>

        {editing && (
          <div className="animate-ob-rise mt-4 flex items-center justify-center gap-5 border-t border-white/10 pt-4">
            <StepperButton
              size="sm"
              direction="decrease"
              onClick={() => nudgeCalories(-CALORIE_STEP)}
              label={`-${CALORIE_STEP} kcal`}
            />
            <span className="text-[13px] font-semibold text-white/60">{planStep.editHint}</span>
            <StepperButton
              size="sm"
              direction="increase"
              onClick={() => nudgeCalories(CALORIE_STEP)}
              label={`+${CALORIE_STEP} kcal`}
            />
          </div>
        )}
      </div>

      {/* Macros — protein first so it lands right in the RTL row. */}
      <div className="mt-3.5 grid grid-cols-3 gap-3">
        <MacroCard
          emoji="🥩"
          grams={plan.macros.proteinG}
          label={planStep.proteinLabel}
          surface="bg-ob-red-deep"
          tint="text-ob-red"
          bubble="bg-ob-red/15"
          delay={80}
          editing={editing}
          onNudge={(delta) =>
            patch({ customProteinG: Math.max(0, plan.macros.proteinG + delta) })
          }
        />
        <MacroCard
          emoji="🥑"
          grams={plan.macros.fatG}
          label={planStep.fatLabel}
          surface="bg-ob-green-deep"
          tint="text-ob-green"
          bubble="bg-ob-green/15"
          delay={140}
          editing={editing}
          onNudge={(delta) => patch({ customFatG: Math.max(0, plan.macros.fatG + delta) })}
        />
        <MacroCard
          emoji="🍞"
          grams={plan.macros.carbsG}
          label={planStep.carbsLabel}
          surface="bg-ob-blue-deep"
          tint="text-ob-blue-text"
          bubble="bg-ob-blue/20"
          delay={200}
          editing={editing}
          onNudge={(delta) => patch({ customCarbsG: Math.max(0, plan.macros.carbsG + delta) })}
        />
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <span
          className={`rounded-full px-4 py-1.5 text-[13px] font-bold ${
            plan.isCustomised
              ? "bg-ob-blue-deep text-ob-blue-text"
              : "bg-ob-green-deep text-ob-green-text"
          }`}
        >
          • {plan.isCustomised ? planStep.customBadge : planStep.recommendedBadge}
        </span>

        {plan.isCustomised && (
          <button
            type="button"
            onClick={resetToRecommended}
            className="animate-ob-rise flex items-center gap-1.5 rounded-full border border-ob-blue/40 px-4 py-2 text-[13px] font-bold text-ob-blue-text transition-colors duration-200 hover:bg-ob-blue/10"
          >
            <RotateCcw className="h-3.5 w-3.5" strokeWidth={2.4} />
            {planStep.reset}
          </button>
        )}
      </div>

      <p className="mx-auto mt-5 max-w-[300px] text-center text-[12.5px] leading-[1.7] text-ob-text-faint">
        {planStep.footnote}
      </p>
    </StepFrame>
  );
}

function MacroCard({
  emoji,
  grams,
  label,
  surface,
  tint,
  bubble,
  delay,
  editing,
  onNudge,
}: {
  emoji: string;
  grams: number;
  label: string;
  surface: string;
  tint: string;
  bubble: string;
  delay: number;
  editing: boolean;
  onNudge: (delta: number) => void;
}) {
  const value = useCountUp(grams);

  return (
    <div
      style={{ animationDelay: `${delay}ms` }}
      className={`animate-ob-rise flex flex-col items-center rounded-[20px] px-2 py-4 ${surface}`}
    >
      <span
        aria-hidden
        className={`grid h-11 w-11 place-items-center rounded-full text-[20px] ${bubble}`}
      >
        {emoji}
      </span>
      <p className={`mt-2.5 text-[21px] font-extrabold tabular-nums ${tint}`} dir="ltr">
        {value}g
      </p>
      <p className="mt-0.5 text-[12.5px] text-white/60">{label}</p>

      {editing && (
        <div className="mt-3 flex items-center gap-2">
          <StepperButton
            size="sm"
            direction="decrease"
            onClick={() => onNudge(-MACRO_STEP)}
            label={`${label} -${MACRO_STEP}g`}
          />
          <StepperButton
            size="sm"
            direction="increase"
            onClick={() => onNudge(MACRO_STEP)}
            label={`${label} +${MACRO_STEP}g`}
          />
        </div>
      )}
    </div>
  );
}
