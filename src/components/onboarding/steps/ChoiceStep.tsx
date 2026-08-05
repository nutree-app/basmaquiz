"use client";

import type { Choice } from "@/lib/onboarding/content";
import ChoiceList from "../ChoiceList";
import StepFooter from "../StepFooter";
import StepFrame from "../StepFrame";
import TipCard from "../TipCard";

/**
 * Every single-select screen in the flow.
 *
 * Two behaviours, matching the app: screens with `autoAdvance` move on as soon
 * as an answer is tapped and show only the back control, while the rest wait
 * for "متابعة" — which stays disabled until something is chosen.
 */
export default function ChoiceStep<T extends string>({
  title,
  subtitle,
  choices,
  value,
  onChange,
  onNext,
  onBack,
  autoAdvance = false,
  tiledEmoji = false,
  tip,
}: {
  title: string;
  subtitle: string;
  choices: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
  onNext: () => void;
  onBack?: () => void;
  autoAdvance?: boolean;
  tiledEmoji?: boolean;
  tip?: string;
}) {
  return (
    <StepFrame
      title={title}
      subtitle={subtitle}
      footer={
        <StepFooter
          showNext={!autoAdvance}
          onNext={onNext}
          nextDisabled={value === null}
          onBack={onBack}
        />
      }
    >
      <ChoiceList
        name={title}
        choices={choices}
        value={value}
        onChange={onChange}
        onAutoAdvance={autoAdvance ? onNext : undefined}
        tiledEmoji={tiledEmoji}
      />

      {tip && <TipCard>{tip}</TipCard>}
    </StepFrame>
  );
}
