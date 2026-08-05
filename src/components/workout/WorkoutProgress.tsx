"use client";

/**
 * "الخطوة N من M" on the right, the percentage on the left, and a pink bar that
 * animates its width between steps — the onboarding's progress header with
 * Basmafit's accent.
 */
export function WorkoutProgress({ current, total }: { current: number; total: number }) {
  const step = current + 1;
  const percent = Math.min(100, Math.round((step / total) * 100));

  return (
    <div className="shrink-0 px-6 pb-3 pt-4">
      <div className="flex items-baseline justify-between">
        <span className="text-[15px] font-bold text-white">
          الخطوة {step} من {total}
        </span>
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
        aria-label={`الخطوة ${step} من ${total}`}
      >
        <div
          className="h-full rounded-full bg-wk-pink shadow-[0_0_12px_rgba(214,75,120,0.6)] transition-[width] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
