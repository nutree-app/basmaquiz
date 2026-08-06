"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Check } from "@/components/onboarding/icons";
import { planStep } from "@/lib/onboarding/content";
import type { DerivedPlan } from "@/lib/onboarding/calculations";
import { offerStep } from "@/lib/workout-onboarding/content";
import { getBasmafitProduct } from "@/lib/workout-onboarding/product";
import { buildTrainingSplit } from "@/lib/workout-onboarding/split";
import { clearWorkoutOnboarding } from "@/lib/workout-onboarding/state";
import { TRAINING_DAYS_LABEL, type WorkoutOnboardingState } from "@/lib/workout-onboarding/types";
import { trackEvent } from "@/lib/analytics";
import StepFooter from "@/components/onboarding/StepFooter";

/**
 * Step 19 — the finished plan, in the Nutree offer layout with Basmafit copy.
 *
 * Keeps the Nutree surfaces (navy cards, orange calorie figure, red/green/blue
 * macro cards); only the CTA takes the flow's yellow. It opens the Basmafit
 * product that matches the goal answered on step 3.
 */
export default function BasmafitOfferStep({
  state,
  plan,
  onBack,
}: {
  state: WorkoutOnboardingState;
  plan: DerivedPlan;
  onBack?: () => void;
}) {
  const split = buildTrainingSplit(state);
  const product = getBasmafitProduct(state.goal);
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("workout_onboarding_plan_ready", {
      calories: plan.calories,
      goal: state.goal ?? "",
      trainingLocation: state.trainingLocation ?? "",
      trainingDays: state.trainingDays ?? 0,
      productKey: product.key,
    });
  }, [plan.calories, state.goal, state.trainingLocation, state.trainingDays, product.key]);

  const checkout = () => {
    trackEvent("workout_onboarding_checkout_click", {
      productKey: product.key,
      productTitle: product.title,
      goal: state.goal ?? "",
      trainingLocation: state.trainingLocation ?? "",
      trainingDays: state.trainingDays ?? 0,
    });
    // The run is finished — don't let a later visit resume on this screen.
    clearWorkoutOnboarding();
    window.location.href = product.url;
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
        <div className="pb-4">
          <header className="animate-ob-rise pt-5 text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ob-green-deep px-3.5 py-1.5 text-[12.5px] font-bold text-ob-green-text">
              <Check className="h-3.5 w-3.5" strokeWidth={3} />
              {offerStep.eyebrow}
            </span>

            <h1 className="mt-4 text-[28px] font-extrabold leading-tight text-white">
              {offerStep.title}
            </h1>
            <p className="mx-auto mt-2.5 max-w-[330px] text-balance text-[15px] leading-[1.7] text-ob-text-dim">
              {offerStep.subtitle}
            </p>
          </header>

          {/* Nutrition — the Nutree plan card, colours unchanged. */}
          <section
            style={{ animationDelay: "90ms" }}
            className="animate-ob-rise mt-6 rounded-[22px] border border-white/[0.07] bg-ob-card p-4"
          >
            <p className="text-[13px] font-bold text-ob-text-dim">{offerStep.planSummaryTitle}</p>

            <div className="mt-3 flex items-baseline gap-2">
              <span
                className="text-[34px] font-extrabold leading-none text-[#FF9F1C] tabular-nums"
                dir="ltr"
              >
                {plan.calories}
              </span>
              <span className="text-[13.5px] font-semibold text-white/70">
                {offerStep.caloriesUnit}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <MiniMacro grams={plan.macros.proteinG} label={planStep.proteinLabel} surface="bg-ob-red-deep" tint="text-ob-red" />
              <MiniMacro grams={plan.macros.fatG} label={planStep.fatLabel} surface="bg-ob-green-deep" tint="text-ob-green" />
              <MiniMacro grams={plan.macros.carbsG} label={planStep.carbsLabel} surface="bg-ob-blue-deep" tint="text-ob-blue-text" />
            </div>
          </section>

          {/* Training — driven by the two workout answers. */}
          {split && (
            <section
              style={{ animationDelay: "140ms" }}
              className="animate-ob-rise mt-4 rounded-[22px] border border-white/[0.07] bg-ob-card p-4"
            >
              <p className="text-[13px] font-bold text-ob-text-dim">{offerStep.trainingTitle}</p>

              <div className="mt-3 grid grid-cols-2 gap-2.5">
                <Stat label={offerStep.locationLabel} value={split.locationLabel} />
                <Stat
                  label={offerStep.daysLabel}
                  value={TRAINING_DAYS_LABEL[split.days]}
                />
              </div>

              <p className="mt-3 text-[13px] font-bold text-white">{offerStep.splitLabel}</p>
              <p className="mt-1 text-[13.5px] leading-6 text-ob-text-dim">{split.splitName}</p>

              <ol className="mt-3 flex flex-col gap-2">
                {split.schedule.map((day) => (
                  <li key={day.day} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-ob-green/15 text-[12px] font-extrabold text-ob-green-text tabular-nums"
                    >
                      {day.day}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13.5px] font-bold text-white">{day.title}</span>
                      <span className="mt-0.5 block text-[12.5px] leading-5 text-ob-text-faint">
                        {day.exercises.join(" · ")}
                      </span>
                    </span>
                  </li>
                ))}
              </ol>

              <p className="mt-3 text-[12.5px] leading-6 text-ob-text-faint">
                {split.equipmentNote} · {split.intensity}
              </p>
            </section>
          )}

          {/* What the product includes. */}
          <section
            style={{ animationDelay: "190ms" }}
            className="animate-ob-rise relative mt-4 overflow-hidden rounded-[26px] border border-ob-green/30 bg-linear-to-b from-ob-green/[0.10] to-ob-card p-5"
          >
            <div
              aria-hidden
              className="animate-ob-glow pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-ob-green/25 blur-3xl"
            />
            <div className="relative">
              <p className="text-[15px] font-extrabold text-white">{product.title}</p>
              <p className="mt-4 text-[13px] font-bold text-ob-text-dim">
                {offerStep.includedTitle}
              </p>

              <ul className="mt-3 flex flex-col gap-2.5">
                {offerStep.features.map((feature, index) => (
                  <li
                    key={feature}
                    style={{ animationDelay: `${220 + index * 32}ms` }}
                    className="animate-ob-rise flex items-start gap-2.5"
                  >
                    <span
                      aria-hidden
                      className="mt-px grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full bg-ob-green/20"
                    >
                      <Check className="h-3 w-3 text-ob-green" strokeWidth={3.2} />
                    </span>
                    <span className="text-[14.5px] leading-snug text-white/90">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <p className="mx-auto mt-4 max-w-[320px] text-center text-[12.5px] leading-[1.7] text-ob-text-faint">
            {offerStep.reassurance}
          </p>
        </div>
      </div>

      <div className="shrink-0 border-t border-white/[0.06] bg-ob-bg/95 px-6 pb-6 pt-3 backdrop-blur-sm">
        <button
          type="button"
          onClick={checkout}
          className="relative flex h-[60px] w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[var(--ob-cta)] text-[17px] font-extrabold text-[var(--ob-cta-contrast)] shadow-[0_14px_38px_-12px_var(--ob-cta-glow-strong)] transition-transform duration-200 active:scale-[0.98]"
        >
          {offerStep.cta}
          <ArrowLeft className="h-5 w-5" strokeWidth={2.6} />
          <span
            aria-hidden
            className="animate-ob-sheen pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
          />
        </button>

        <div className="mt-3">
          <StepFooter showNext={false} onBack={onBack} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ob-card-alt px-3 py-2.5">
      <p className="text-[12px] text-ob-text-dim">{label}</p>
      <p className="mt-0.5 text-[14.5px] font-bold text-white">{value}</p>
    </div>
  );
}

function MiniMacro({
  grams,
  label,
  surface,
  tint,
}: {
  grams: number;
  label: string;
  surface: string;
  tint: string;
}) {
  return (
    <div className={`rounded-2xl px-2 py-3 text-center ${surface}`}>
      <p className={`text-[17px] font-extrabold tabular-nums ${tint}`} dir="ltr">
        {grams}g
      </p>
      <p className="mt-0.5 text-[11.5px] text-white/60">{label}</p>
    </div>
  );
}
