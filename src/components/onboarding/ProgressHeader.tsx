"use client";

import { ui } from "@/lib/onboarding/content";

/**
 * "الخطوة N من 18" on the right, the percentage on the left, and a bar that
 * animates its width between steps. The offer screen is step 18, so the bar
 * closes at 100% rather than stopping short.
 */
export default function ProgressHeader({
  step,
  total,
  percent,
}: {
  step: number;
  total: number;
  percent: number;
}) {
  return (
    <div className="shrink-0 px-6 pb-3 pt-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-bold text-white">{ui.stepCounter(step, total)}</span>
        <span className="text-[15px] font-bold text-white" dir="ltr">
          {percent}%
        </span>
      </div>

      <div
        className="mt-2.5 h-[5px] w-full overflow-hidden rounded-full bg-ob-line"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={step}
        aria-label={ui.stepCounter(step, total)}
      >
        <div
          className="h-full rounded-full bg-[var(--ob-accent)] shadow-[0_0_12px_var(--ob-accent-bar-glow)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
