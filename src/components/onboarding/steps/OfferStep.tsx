"use client";

import { useEffect, useRef } from "react";
import { ArrowLeft, Check } from "../icons";
import {
  BASMAFIT_PRODUCT_URL,
  ONBOARDING_EVENTS,
  PLAN_CURRENCY,
  PLAN_DISCOUNT_PERCENT,
  PLAN_ORIGINAL_PRICE,
  PLAN_PRICE,
} from "@/lib/onboarding/config";
import { offerStep, planStep } from "@/lib/onboarding/content";
import { trackEvent } from "@/lib/analytics";
import StepFooter from "../StepFooter";
import type { StepProps } from "../stepProps";

/**
 * The final screen — Nutree Pro, in place of the app's account-creation step.
 *
 * The site never takes payment: the button hands the visitor to the Basmafit
 * storefront where the purchase (and the activation-code fulfilment already
 * wired up server-side) happens. Everything above the button is the plan they
 * just spent eighteen steps building, so the offer reads as the continuation
 * of that work rather than an interruption.
 */
export default function OfferStep({ plan, onBack }: StepProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent(ONBOARDING_EVENTS.offerView, {
      calories: plan.calories,
      goal: plan.direction,
    });
  }, [plan.calories, plan.direction]);

  const checkout = () => {
    trackEvent(ONBOARDING_EVENTS.checkoutClick, {
      value: PLAN_PRICE,
      currency: PLAN_CURRENCY,
      calories: plan.calories,
    });
    window.location.href = BASMAFIT_PRODUCT_URL;
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

            <h1 className="mt-4 flex items-center justify-center gap-2 text-[30px] font-extrabold leading-tight text-white">
              <span aria-hidden>🔥</span>
              {offerStep.title}
            </h1>
            <p className="mx-auto mt-2.5 max-w-[320px] text-balance text-[15px] leading-[1.7] text-ob-text-dim">
              {offerStep.subtitle}
            </p>
          </header>

          {/* Their plan, restated — the reason to keep going. */}
          <section
            style={{ animationDelay: "90ms" }}
            className="animate-ob-rise mt-6 rounded-[22px] border border-white/[0.07] bg-ob-card p-4"
          >
            <p className="text-[13px] font-bold text-ob-text-dim">{offerStep.planSummaryTitle}</p>

            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-[34px] font-extrabold leading-none text-[#FF9F1C] tabular-nums" dir="ltr">
                {plan.calories}
              </span>
              <span className="text-[13.5px] font-semibold text-white/70">
                {offerStep.caloriesUnit}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <MiniMacro
                grams={plan.macros.proteinG}
                label={planStep.proteinLabel}
                surface="bg-ob-red-deep"
                tint="text-ob-red"
              />
              <MiniMacro
                grams={plan.macros.fatG}
                label={planStep.fatLabel}
                surface="bg-ob-green-deep"
                tint="text-ob-green"
              />
              <MiniMacro
                grams={plan.macros.carbsG}
                label={planStep.carbsLabel}
                surface="bg-ob-blue-deep"
                tint="text-ob-blue-text"
              />
            </div>
          </section>

          {/* The offer */}
          <section
            style={{ animationDelay: "160ms" }}
            className="animate-ob-rise relative mt-4 overflow-hidden rounded-[26px] border border-ob-green/30 bg-linear-to-b from-ob-green/[0.10] to-ob-card p-5"
          >
            <div
              aria-hidden
              className="animate-ob-glow pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-ob-green/25 blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-baseline gap-2" dir="ltr">
                  <span className="text-[40px] font-extrabold leading-none text-white tabular-nums">
                    {PLAN_PRICE}
                  </span>
                  <span className="text-[16px] font-bold text-white/80">
                    {offerStep.currency}
                  </span>
                  <span className="text-[16px] font-semibold text-ob-text-faint line-through tabular-nums">
                    {PLAN_ORIGINAL_PRICE}
                  </span>
                </div>

                {/* The figure is isolated so bidi keeps "60%" together
                    instead of flipping the sign to the front. */}
                <span className="shrink-0 rounded-full bg-ob-green px-3 py-1.5 text-[12.5px] font-extrabold text-[#04240F]">
                  {offerStep.saveLabel}{" "}
                  <bdi dir="ltr">{PLAN_DISCOUNT_PERCENT}%</bdi>
                </span>
              </div>

              <p className="mt-1 text-[13px] text-ob-text-dim">{offerStep.perYear}</p>

              <div className="mt-4 flex items-center gap-2 rounded-2xl bg-ob-green-deep px-4 py-3">
                <Check className="h-[18px] w-[18px] shrink-0 text-ob-green-text" strokeWidth={3} />
                <span className="text-[14.5px] font-bold text-ob-green-text">
                  {offerStep.highlight}
                </span>
              </div>

              <p className="mt-5 text-[13px] font-bold text-ob-text-dim">
                {offerStep.includedTitle}
              </p>

              <ul className="mt-3 flex flex-col gap-2.5">
                {offerStep.features.map((feature, index) => (
                  <li
                    key={feature}
                    style={{ animationDelay: `${200 + index * 32}ms` }}
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
          className="relative flex h-[60px] w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-ob-green text-[17px] font-extrabold text-[#04240F] shadow-[0_14px_38px_-12px_rgba(43,217,107,0.75)] transition-transform duration-200 active:scale-[0.98]"
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
