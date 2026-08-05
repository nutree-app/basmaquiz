"use client";

import {
  PACE_MAX_PERCENT,
  PACE_MIN_PERCENT,
  paceBand,
} from "@/lib/onboarding/calculations";
import { paceStep, summaryStep } from "@/lib/onboarding/content";
import { formatSignedKg, formatTargetDate } from "@/lib/onboarding/units";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import type { StepProps } from "../stepProps";

/**
 * Screen 7 — how fast to get there.
 *
 * The slider is a percentage of body weight per week, which is what makes the
 * calorie target, the weekly/monthly deltas and the arrival date all move
 * together as it is dragged.
 */
export default function PaceStep({ state, patch, plan, onNext, onBack }: StepProps) {
  const maintaining = plan.direction === "maintain";
  const sign = plan.direction === "gain" ? 1 : -1;

  return (
    <StepFrame footer={<StepFooter onNext={onNext} onBack={onBack} />}>
      <div className="grid grid-cols-2 gap-3 pt-4">
        <InfoCard
          emoji="🔥"
          value={`${plan.calories} kcal`}
          label={paceStep.caloriesLabel}
        />
        <InfoCard
          emoji="📅"
          value={
            plan.timeline.targetDate
              ? formatTargetDate(plan.timeline.targetDate)
              : paceStep.maintainDate
          }
          label={paceStep.dateLabel}
        />
      </div>

      {/* Title and band badge share one line, as in the app — hence the
          slightly tighter type than the other screens. */}
      <div className="mt-7 flex items-center justify-between gap-2">
        <h1 className="text-[22px] font-extrabold leading-tight text-white">{paceStep.title}</h1>
        {!maintaining && (
          <span className="shrink-0 rounded-full bg-ob-blue-deep px-3 py-1.5 text-[12px] font-bold text-ob-blue-text">
            {paceStep.bands[paceBand(state.pacePercent)]}
          </span>
        )}
      </div>

      <p className="mt-2 text-[15px] text-ob-text-dim">
        {maintaining ? paceStep.maintainRate : paceStep.rate(state.pacePercent.toFixed(2))}
      </p>

      {!maintaining && (
        <>
          {/* Turtle on the left, bolt on the right — forced LTR to match. */}
          <div dir="ltr" className="mt-14 flex items-center gap-4">
            <span aria-hidden className="text-[24px] leading-none">
              🐢
            </span>
            <input
              type="range"
              className="ob-range flex-1"
              min={PACE_MIN_PERCENT}
              max={PACE_MAX_PERCENT}
              step={0.01}
              value={state.pacePercent}
              onChange={(event) => patch({ pacePercent: Number(event.target.value) })}
              aria-label={paceStep.title}
              aria-valuetext={paceStep.rate(state.pacePercent.toFixed(2))}
              style={{
                // Fills the track up to the thumb in WebKit, which has no
                // ::-moz-range-progress equivalent.
                ["--ob-range-track" as string]: `linear-gradient(to right, #0A84FF 0%, #0A84FF ${
                  ((state.pacePercent - PACE_MIN_PERCENT) /
                    (PACE_MAX_PERCENT - PACE_MIN_PERCENT)) *
                  100
                }%, #232A3D ${
                  ((state.pacePercent - PACE_MIN_PERCENT) /
                    (PACE_MAX_PERCENT - PACE_MIN_PERCENT)) *
                  100
                }%, #232A3D 100%)`,
              }}
            />
            <span aria-hidden className="text-[24px] leading-none">
              ⚡
            </span>
          </div>

          <div className="mt-14 grid grid-cols-2 gap-3">
            <StatCard
              value={`${formatSignedKg(sign * plan.weeklyKg)} kg`}
              label={paceStep.weeklyLabel}
            />
            <StatCard
              value={`${formatSignedKg(sign * plan.monthlyKg)} kg`}
              label={paceStep.monthlyLabel}
            />
          </div>
        </>
      )}

      {maintaining && (
        <div className="mt-12 rounded-[22px] border border-white/[0.06] bg-ob-card px-5 py-7 text-center">
          <p className="text-[15px] leading-[1.8] text-ob-text-dim">
            {summaryStep.tip}
          </p>
        </div>
      )}
    </StepFrame>
  );
}

/** Emoji on the trailing edge, text centred in what's left — as in the app. */
function InfoCard({ emoji, value, label }: { emoji: string; value: string; label: string }) {
  return (
    <div className="animate-ob-rise flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-ob-card px-3 py-3.5">
      <span aria-hidden className="shrink-0 text-[20px] leading-none">
        {emoji}
      </span>
      <div className="min-w-0 flex-1 text-center">
        <p className="truncate text-[16px] font-extrabold text-white tabular-nums" dir="ltr">
          {value}
        </p>
        <p className="mt-0.5 truncate text-[12px] text-ob-text-dim">{label}</p>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-ob-card px-3 py-4 text-center">
      <p className="text-[22px] font-extrabold text-white tabular-nums" dir="ltr">
        {value}
      </p>
      <p className="mt-1 text-[12px] text-ob-text-dim">{label}</p>
    </div>
  );
}
