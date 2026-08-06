"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildPlan } from "@/lib/onboarding/calculations";
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
  trackingChoices,
  trackingStep,
} from "@/lib/onboarding/content";
import PhoneShell from "@/components/onboarding/PhoneShell";
import ProgressHeader from "@/components/onboarding/ProgressHeader";
import BodyStep from "@/components/onboarding/steps/BodyStep";
import ChoiceStep from "@/components/onboarding/steps/ChoiceStep";
import PaceStep from "@/components/onboarding/steps/PaceStep";
import PersonalStep from "@/components/onboarding/steps/PersonalStep";
import PlanStep from "@/components/onboarding/steps/PlanStep";
import SummaryStep from "@/components/onboarding/steps/SummaryStep";
import TargetWeightStep from "@/components/onboarding/steps/TargetWeightStep";
import type { StepProps } from "@/components/onboarding/stepProps";
import { WorkoutShell } from "@/components/workout/WorkoutShell";
import { WorkoutHeroScreen } from "@/components/workout-onboarding/WorkoutHeroScreen";
import { trackEvent } from "@/lib/analytics";
import {
  STEP_IDS,
  TOTAL_STEPS,
  displayStep,
  stepPercent,
  type StepId,
} from "@/lib/workout-onboarding/steps";
import {
  trainingDaysChoices,
  trainingDaysStep,
  trainingLocationChoices,
  trainingLocationStep,
  transitionSteps,
} from "@/lib/workout-onboarding/content";
import {
  saveProgress,
  useWorkoutBoot,
  useWorkoutSession,
  type WorkoutBoot,
} from "@/lib/workout-onboarding/state";
import type {
  TrainingDays,
  TrainingLocation,
  WorkoutOnboardingState,
} from "@/lib/workout-onboarding/types";
import BasmafitOfferStep from "./BasmafitOfferStep";
import TransitionStep from "./TransitionStep";

/**
 * The Basmafit workout onboarding: nineteen counted steps built on the Nutree
 * flow's own screens and calculations.
 *
 * The step components are imported from the Nutree flow rather than copied and
 * restyled — they read their accent from `data-ob-accent`, which the shells set
 * to "basmafit" here, so this flow gets pink selections and a yellow primary
 * action while /onboarding keeps its green.
 *
 * Steps 7–13 continue on their own the moment an answer is tapped; step 14
 * (the plan) and everything after it wait for the "متابعة" button.
 */
export default function WorkoutOnboardingFlow() {
  const boot = useWorkoutBoot();
  return <Flow key={boot.token} boot={boot} />;
}

function Flow({ boot }: { boot: WorkoutBoot }) {
  const { state, stepId, setStepId, patch } = useWorkoutSession(boot);

  // Fixed at mount so the arrival date can't drift mid-session.
  const [now] = useState(() => new Date());
  const plan = useMemo(() => buildPlan(state, now), [state, now]);

  const index = STEP_IDS.indexOf(stepId);
  const canPersist = boot.token === "client";

  useEffect(() => {
    if (!canPersist) return;
    saveProgress(stepId, state);
  }, [canPersist, stepId, state]);

  const reported = useRef<StepId | null>(null);
  useEffect(() => {
    if (reported.current === stepId) return;
    reported.current = stepId;
    trackEvent("workout_onboarding_step_view", {
      step: stepId,
      index: displayStep(stepId),
      total: TOTAL_STEPS,
    });
  }, [stepId]);

  const goNext = useCallback(() => {
    setStepId((current) => {
      const at = STEP_IDS.indexOf(current);
      return STEP_IDS[Math.min(STEP_IDS.length - 1, at + 1)];
    });
  }, [setStepId]);

  const goBack = useCallback(() => {
    setStepId((current) => {
      const at = STEP_IDS.indexOf(current);
      return STEP_IDS[Math.max(0, at - 1)];
    });
  }, [setStepId]);

  /*
    Back from the first automatic screen would immediately replay it forward, so
    the offer's back control skips the whole build sequence and lands on the
    last real question instead.
  */
  const backFromOffer = useCallback(() => {
    setStepId("summary");
  }, [setStepId]);

  if (stepId === "welcome") {
    return (
      <WorkoutShell>
        <WorkoutHeroScreen onStart={goNext} />
      </WorkoutShell>
    );
  }

  const stepProps: StepProps = {
    state,
    patch,
    plan,
    onNext: goNext,
    onBack: index > 1 ? goBack : undefined,
  };

  return (
    <PhoneShell accent="basmafit">
      <ProgressHeader
        step={displayStep(stepId)}
        total={TOTAL_STEPS}
        percent={stepPercent(stepId)}
      />

      <main key={stepId} className="animate-ob-enter min-h-0 flex-1">
        {renderStep({ stepId, stepProps, state, patch, plan, goNext, backFromOffer })}
      </main>
    </PhoneShell>
  );
}

function renderStep({
  stepId,
  stepProps,
  state,
  patch,
  plan,
  goNext,
  backFromOffer,
}: {
  stepId: StepId;
  stepProps: StepProps;
  state: WorkoutOnboardingState;
  patch: (patch: Partial<WorkoutOnboardingState>) => void;
  plan: ReturnType<typeof buildPlan>;
  goNext: () => void;
  backFromOffer: () => void;
}) {
  const { onNext, onBack } = stepProps;

  switch (stepId) {
    case "personal":
      return <PersonalStep {...stepProps} />;

    case "body":
      return <BodyStep {...stepProps} />;

    case "goal":
      return (
        <ChoiceStep
          title={goalStep.title}
          subtitle={goalStep.subtitle}
          choices={goalChoices}
          value={state.goal}
          // Changing the goal invalidates any target already set.
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
      return <TargetWeightStep {...stepProps} />;

    case "pace":
      return <PaceStep {...stepProps} />;

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

    /* ---- step 9: where they train ---- */
    case "trainingLocation":
      return (
        <ChoiceStep
          title={trainingLocationStep.title}
          subtitle={trainingLocationStep.subtitle}
          choices={trainingLocationChoices}
          value={state.trainingLocation}
          onChange={(trainingLocation: TrainingLocation) => patch({ trainingLocation })}
          onNext={onNext}
          onBack={onBack}
          tiledEmoji
          autoAdvance
        />
      );

    /* ---- step 10: how many days ---- */
    case "trainingDays":
      return (
        <ChoiceStep
          title={trainingDaysStep.title}
          subtitle={trainingDaysStep.subtitle}
          choices={trainingDaysChoices}
          value={state.trainingDays === null ? null : String(state.trainingDays)}
          onChange={(value) =>
            patch({ trainingDays: Number(value) as TrainingDays })
          }
          onNext={onNext}
          onBack={onBack}
          tiledEmoji
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

    /* Step 14. The first screen after the auto-advancing block, so it keeps
       its "متابعة" button — nothing past step 13 moves on by itself. */
    case "plan":
      return <PlanStep {...stepProps} />;

    case "summary":
      return <SummaryStep {...stepProps} />;

    case "analyzing":
    case "building":
    case "calculating":
      return (
        <TransitionStep
          emoji={transitionSteps[stepId].emoji}
          title={transitionSteps[stepId].title}
          subtitle={transitionSteps[stepId].subtitle}
          onDone={goNext}
        />
      );

    case "offer":
      return <BasmafitOfferStep state={state} plan={plan} onBack={backFromOffer} />;

    default:
      return null;
  }
}
