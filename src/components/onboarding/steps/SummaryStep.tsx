"use client";

import { Calendar, Flag, Flame } from "../icons";
import type { OnboardingIcon } from "../icons";
import type { ReactNode } from "react";
import { summaryStep } from "@/lib/onboarding/content";
import { formatDecimal } from "@/lib/onboarding/units";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import TipCard from "../TipCard";
import type { StepProps } from "../stepProps";

/** Screen 16 — the commitment recap, right before the offer. */
export default function SummaryStep({ plan, onNext, onBack }: StepProps) {
  const maintaining = plan.direction === "maintain";

  return (
    <StepFrame footer={<StepFooter onNext={onNext} onBack={onBack} />}>
      <div className="pt-10 text-center">
        <span aria-hidden className="animate-ob-rise inline-block text-[64px] leading-none">
          🔥
        </span>
        <h1 className="animate-ob-rise mt-5 text-balance text-[27px] font-extrabold leading-[1.3] text-white">
          {summaryStep.title}
        </h1>
        <p className="animate-ob-rise mt-2.5 text-[15px] text-ob-text-dim">
          {summaryStep.subtitle}
        </p>
      </div>

      <div
        style={{ animationDelay: "140ms" }}
        className="animate-ob-rise mt-8 divide-y divide-white/[0.07] rounded-[22px] border border-white/[0.06] bg-ob-card px-4"
      >
        <SummaryRow
          icon={Calendar}
          tone="bg-ob-blue-deep text-ob-blue-text"
          label={summaryStep.durationLabel}
        >
          <span className="text-[17px] font-extrabold text-white">
            {maintaining
              ? summaryStep.durationOngoing
              : summaryStep.durationValue(plan.timeline.weeks)}
          </span>
        </SummaryRow>

        <SummaryRow
          icon={Flame}
          tone="bg-ob-amber-deep text-ob-amber"
          label={summaryStep.dailyLabel}
        >
          <span className="text-[17px] font-extrabold text-white tabular-nums" dir="ltr">
            {plan.calories} kcal
          </span>
        </SummaryRow>

        <SummaryRow
          icon={Flag}
          tone="bg-ob-green-deep text-ob-green-text"
          label={summaryStep.resultLabel}
        >
          {/* Reads right-to-left — current weight on the right, goal on the
              left, with the arrow between them, exactly as the app shows it. */}
          <span className="flex items-center gap-2 text-[17px] font-extrabold tabular-nums">
            <span dir="ltr" className="text-ob-text-faint">
              {formatDecimal(plan.currentWeightKg, 0)} kg
            </span>
            <span aria-hidden className="text-ob-text-faint">
              ←
            </span>
            <span dir="ltr" className="text-ob-green">
              {formatDecimal(plan.targetWeightKg, 0)} kg
            </span>
          </span>
        </SummaryRow>
      </div>

      <TipCard>{summaryStep.tip}</TipCard>
    </StepFrame>
  );
}

function SummaryRow({
  icon: Icon,
  tone,
  label,
  children,
}: {
  icon: OnboardingIcon;
  tone: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-4">
      <span aria-hidden className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}>
        <Icon className="h-[18px] w-[18px]" strokeWidth={2.2} />
      </span>
      <span className="flex-1 text-[15px] font-semibold text-ob-text-dim">{label}</span>
      {children}
    </div>
  );
}
