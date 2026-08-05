"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildPlan } from "@/lib/onboarding/calculations";
import { ONBOARDING_EVENTS } from "@/lib/onboarding/config";
import {
  activityChoices,
  activityStep,
  dietChoices,
  dietStep,
  goalChoices,
  goalStep,
  habitChoices,
  habitStep,
  motivationChoices,
  motivationStep,
  proteinChoices,
  proteinStep,
  referralChoices,
  referralStep,
  trackingChoices,
  trackingStep,
} from "@/lib/onboarding/content";
import { useOnboardingBoot, useOnboardingSession } from "@/lib/onboarding/state";
import type { OnboardingBoot } from "@/lib/onboarding/state";
import { LAST_STEP_INDEX, STEP_IDS, TOTAL_STEPS, displayStep, stepPercent } from "@/lib/onboarding/steps";
import { trackEvent } from "@/lib/analytics";
import PhoneShell from "./PhoneShell";
import ProgressHeader from "./ProgressHeader";
import BodyStep from "./steps/BodyStep";
import ChoiceStep from "./steps/ChoiceStep";
import OfferStep from "./steps/OfferStep";
import PaceStep from "./steps/PaceStep";
import PersonalStep from "./steps/PersonalStep";
import PlanStep from "./steps/PlanStep";
import SummaryStep from "./steps/SummaryStep";
import TargetWeightStep from "./steps/TargetWeightStep";
import WaterStep from "./steps/WaterStep";
import WelcomeStep from "./steps/WelcomeStep";
import type { StepProps } from "./stepProps";

/**
 * The eighteen-step flow: one state object, one derived plan, one screen on
 * screen at a time.
 *
 * Steps are addressed by id rather than index so the progress numbers (which
 * pair the welcome and personal screens under "1 من 18", exactly as the app
 * does) stay declarative in steps.ts.
 */
export default function OnboardingFlow() {
  const boot = useOnboardingBoot();

  /*
    Server and hydration both render the "server" boot, so the markup matches;
    React then swaps in the client snapshot — which clears any previous run and
    starts at step 1 — and this subtree restarts once, before any interaction.
  */
  return <Flow key={boot.token} boot={boot} />;
}

function Flow({ boot }: { boot: OnboardingBoot }) {
  const { state, stepIndex, setStepIndex, patch } = useOnboardingSession(boot);

  // Fixed at mount so the arrival date can't drift mid-session.
  const [now] = useState(() => new Date());
  const plan = useMemo(() => buildPlan(state, now), [state, now]);

  const stepId = STEP_IDS[stepIndex];

  const reportedStep = useRef<string | null>(null);
  useEffect(() => {
    if (reportedStep.current === stepId) return;
    reportedStep.current = stepId;
    trackEvent(ONBOARDING_EVENTS.stepView, { step: stepId, index: displayStep(stepId) });
    if (stepId === "plan") {
      trackEvent(ONBOARDING_EVENTS.planReady, { calories: plan.calories });
    }
    // plan.calories is read only when the plan step is reached; tracking it as
    // a dependency would re-fire the event on every stepper tap.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepId]);

  const goNext = useCallback(() => {
    setStepIndex((index) => Math.min(LAST_STEP_INDEX, index + 1));
  }, [setStepIndex]);

  const goBack = useCallback(() => {
    setStepIndex((index) => Math.max(0, index - 1));
  }, [setStepIndex]);

  const stepProps: StepProps = {
    state,
    patch,
    plan,
    onNext: goNext,
    onBack: stepIndex > 0 ? goBack : undefined,
  };

  return (
    <PhoneShell>
      <ProgressHeader
        step={displayStep(stepId)}
        total={TOTAL_STEPS}
        percent={stepId === "offer" ? 100 : stepPercent(stepId)}
      />

      {/* Remounting on `key` gives each screen a clean entrance and resets its
          own scroll position without any imperative scrollTo. */}
      <main key={stepId} className="animate-ob-enter min-h-0 flex-1">
        {renderStep(stepId, stepProps)}
      </main>
    </PhoneShell>
  );
}

function renderStep(stepId: (typeof STEP_IDS)[number], props: StepProps) {
  const { state, patch, onNext, onBack } = props;

  switch (stepId) {
    case "welcome":
      return <WelcomeStep onNext={onNext} />;

    case "personal":
      return <PersonalStep {...props} />;

    case "body":
      return <BodyStep {...props} />;

    case "goal":
      return (
        <ChoiceStep
          title={goalStep.title}
          subtitle={goalStep.subtitle}
          choices={goalChoices}
          value={state.goal}
          // Changing the goal invalidates any target the user already set, so
          // the next screen re-seeds from the new direction.
          onChange={(goal) => patch({ goal, targetWeightKg: null })}
          onNext={onNext}
          onBack={onBack}
          tiledEmoji
        />
      );

    case "activity":
      return (
        <ChoiceStep
          title={activityStep.title}
          subtitle={activityStep.subtitle}
          choices={activityChoices}
          value={state.activity}
          onChange={(activity) => patch({ activity })}
          onNext={onNext}
          onBack={onBack}
          tip={activityStep.tip}
        />
      );

    case "target":
      return <TargetWeightStep {...props} />;

    case "pace":
      return <PaceStep {...props} />;

    case "diet":
      return (
        <ChoiceStep
          title={dietStep.title}
          subtitle={dietStep.subtitle}
          choices={dietChoices}
          value={state.dietStyle}
          onChange={(dietStyle) => patch({ dietStyle })}
          onNext={onNext}
          onBack={onBack}
          autoAdvance
        />
      );

    case "protein":
      return (
        <ChoiceStep
          title={proteinStep.title}
          subtitle={proteinStep.subtitle}
          choices={proteinChoices}
          value={state.proteinLevel}
          onChange={(proteinLevel) => patch({ proteinLevel })}
          onNext={onNext}
          onBack={onBack}
          autoAdvance
        />
      );

    case "habits":
      return (
        <ChoiceStep
          title={habitStep.title}
          subtitle={habitStep.subtitle}
          choices={habitChoices}
          value={state.eatingHabit}
          onChange={(eatingHabit) => patch({ eatingHabit })}
          onNext={onNext}
          onBack={onBack}
          autoAdvance
        />
      );

    case "motivation":
      return (
        <ChoiceStep
          title={motivationStep.title}
          subtitle={motivationStep.subtitle}
          choices={motivationChoices}
          value={state.healthMotivation}
          onChange={(healthMotivation) => patch({ healthMotivation })}
          onNext={onNext}
          onBack={onBack}
          autoAdvance
        />
      );

    case "tracking":
      return (
        <ChoiceStep
          title={trackingStep.title}
          subtitle={trackingStep.subtitle}
          choices={trackingChoices}
          value={state.trackingExperience}
          onChange={(trackingExperience) => patch({ trackingExperience })}
          onNext={onNext}
          onBack={onBack}
          autoAdvance
        />
      );

    case "referral":
      return (
        <ChoiceStep
          title={referralStep.title}
          subtitle={referralStep.subtitle}
          choices={referralChoices}
          value={state.referral}
          onChange={(referral) => patch({ referral })}
          onNext={onNext}
          onBack={onBack}
        />
      );

    case "water":
      return <WaterStep {...props} />;

    case "plan":
      return <PlanStep {...props} />;

    case "summary":
      return <SummaryStep {...props} />;

    case "offer":
      return <OfferStep {...props} />;

    default:
      return null;
  }
}
