"use client";

import type { CSSProperties } from "react";
import { WATER_MAX_ML, WATER_MIN_ML } from "@/lib/onboarding/calculations";
import { waterStep } from "@/lib/onboarding/content";

/** Keeps the surface off the very top and bottom of the circle. */
const FILL_MIN_PERCENT = 18;
const FILL_MAX_PERCENT = 90;

/**
 * The hydration goal, drawn as a filling glass. The level animates between
 * values and two offset wave layers drift continuously, so the dial reads as
 * liquid rather than a progress bar.
 */
export default function WaterDial({ ml }: { ml: number }) {
  const ratio = (ml - WATER_MIN_ML) / (WATER_MAX_ML - WATER_MIN_ML);
  const fill = FILL_MIN_PERCENT + Math.min(1, Math.max(0, ratio)) * (FILL_MAX_PERCENT - FILL_MIN_PERCENT);

  return (
    <div className="relative h-[220px] w-[220px] shrink-0 overflow-hidden rounded-full border border-white/[0.07] bg-[#122238]">
      <div
        className="absolute inset-x-0 bottom-0 transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ height: `${fill}%` }}
      >
        <Wave className="animate-ob-wave" opacity={0.45} />
        <Wave
          className="animate-ob-wave"
          opacity={1}
          style={{ animationDuration: "5s", animationDirection: "reverse" }}
        />
        <div className="h-full w-full bg-[#2E9BFF]" />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        <span
          dir="ltr"
          className="ob-outline-number text-[52px] font-extrabold leading-none tabular-nums"
        >
          {ml}
        </span>
        <span className="text-[15px] font-bold text-white">{waterStep.unit}</span>
      </div>
    </div>
  );
}

/**
 * One sine period repeated twice across a double-width SVG, so translating it
 * by exactly -50% loops without a seam.
 */
function Wave({
  className = "",
  opacity,
  style,
}: {
  className?: string;
  opacity: number;
  style?: CSSProperties;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 20"
      preserveAspectRatio="none"
      style={{ width: "200%", height: 18, opacity, ...style }}
      className={`absolute -top-[13px] left-0 ${className}`}
    >
      <path
        d="M0 10 C 25 0, 75 20, 100 10 C 125 0, 175 20, 200 10 L 200 20 L 0 20 Z"
        fill="#2E9BFF"
      />
    </svg>
  );
}
