import type { DerivedPlan } from "@/lib/onboarding/calculations";
import type { OnboardingState } from "@/lib/onboarding/types";

/** What every screen in the flow receives from OnboardingFlow. */
export interface StepProps {
  state: OnboardingState;
  patch: (patch: Partial<OnboardingState>) => void;
  /** Every displayed number comes from here — screens never recompute. */
  plan: DerivedPlan;
  onNext: () => void;
  onBack?: () => void;
}
