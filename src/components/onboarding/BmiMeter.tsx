"use client";

import { bmiLabels, body } from "@/lib/onboarding/content";
import type { BmiCategory } from "@/lib/onboarding/types";

/** BMI axis shown in the app: 0 → 40, four bands, marker at the live value. */
const SCALE_MAX = 40;
const BANDS = [
  { upTo: 18.5, color: "#2E86FF" },
  { upTo: 25, color: "#22C55E" },
  { upTo: 30, color: "#F5A524" },
  { upTo: SCALE_MAX, color: "#EF4444" },
];
const TICKS = [0, 18.5, 25, 30, SCALE_MAX];

const BADGE_TONE: Record<BmiCategory, string> = {
  underweight: "bg-ob-blue-deep text-ob-blue-text",
  normal: "bg-ob-green-deep text-ob-green-text",
  overweight: "bg-ob-amber-deep text-ob-amber",
  obese: "bg-ob-red-deep text-ob-red",
};

export default function BmiMeter({
  bmi,
  category,
}: {
  bmi: number;
  category: BmiCategory;
}) {
  const markerPercent = Math.min(100, Math.max(0, (bmi / SCALE_MAX) * 100));

  return (
    <div className="rounded-[22px] border border-white/[0.06] bg-ob-card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2.5">
          <span className="text-[30px] font-extrabold leading-none text-white tabular-nums" dir="ltr">
            {bmi.toFixed(1)}
          </span>
          <span className="text-[13.5px] font-semibold text-ob-text-dim">{body.bmiLabel}</span>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-[13px] font-bold transition-colors duration-300 ${BADGE_TONE[category]}`}
        >
          {bmiLabels[category]}
        </span>
      </div>

      {/* Numeric axis: always left-to-right, even inside the RTL page. */}
      <div dir="ltr" className="mt-4">
        <div className="relative h-[7px] w-full overflow-hidden rounded-full">
          <div className="absolute inset-0 flex">
            {BANDS.map((band, index) => {
              const from = index === 0 ? 0 : BANDS[index - 1].upTo;
              return (
                <span
                  key={band.upTo}
                  style={{
                    width: `${((band.upTo - from) / SCALE_MAX) * 100}%`,
                    backgroundColor: band.color,
                  }}
                />
              );
            })}
          </div>

          <span
            aria-hidden
            className="absolute top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)] transition-[left] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ left: `${markerPercent}%` }}
          />
        </div>

        <div className="relative mt-1.5 h-4">
          {TICKS.map((tick) => (
            <span
              key={tick}
              className="absolute -translate-x-1/2 text-[11px] font-medium text-ob-text-faint tabular-nums"
              style={{
                left: `${(tick / SCALE_MAX) * 100}%`,
                transform:
                  tick === 0
                    ? "translateX(0)"
                    : tick === SCALE_MAX
                      ? "translateX(-100%)"
                      : "translateX(-50%)",
              }}
            >
              {tick}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
