"use client";

import { ChevronRight } from "./icons";
import { ui } from "@/lib/onboarding/content";

/**
 * The bottom action row.
 *
 * Mirrors the app: a wide "متابعة" button plus a small square button on the
 * far side. In an RTL layout forward is left, so the chevron pointing right
 * is the *back* control — it is absent on the very first screen and is the
 * only control on the screens that advance the moment you pick an answer.
 */
export default function StepFooter({
  onNext,
  nextDisabled = false,
  nextLabel = ui.continue,
  onBack,
  showNext = true,
}: {
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  onBack?: () => void;
  /** false on the auto-advancing steps, which show only the back control. */
  showNext?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      {showNext ? (
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled}
          className={`h-[54px] flex-1 rounded-[18px] text-[17px] font-bold transition-all duration-200 ${
            nextDisabled
              ? "cursor-not-allowed bg-ob-card-alt text-ob-text-faint"
              : "bg-ob-green text-[#04240F] shadow-[0_10px_30px_-10px_rgba(43,217,107,0.65)] active:scale-[0.98]"
          }`}
        >
          {nextLabel}
        </button>
      ) : (
        <span className="flex-1" />
      )}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label={ui.back}
          className="grid h-[54px] w-[62px] shrink-0 place-items-center rounded-[18px] bg-ob-card-alt text-white/70 transition-colors duration-200 hover:text-white active:scale-[0.97]"
        >
          <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
        </button>
      )}
    </div>
  );
}
