"use client";

import { Minus, Plus } from "./icons";

/** The circular −/+ controls flanking the target-weight and water figures. */
export default function StepperButton({
  direction,
  onClick,
  disabled = false,
  label,
  size = "lg",
}: {
  direction: "increase" | "decrease";
  onClick: () => void;
  disabled?: boolean;
  label: string;
  size?: "sm" | "lg";
}) {
  const Icon = direction === "increase" ? Plus : Minus;
  const box = size === "lg" ? "h-[52px] w-[52px]" : "h-9 w-9";
  const glyph = size === "lg" ? "h-5 w-5" : "h-4 w-4";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid ${box} shrink-0 place-items-center rounded-full border border-white/10 bg-ob-card-alt text-white transition-all duration-150 hover:border-white/25 active:scale-90 disabled:pointer-events-none disabled:opacity-35`}
    >
      <Icon className={glyph} strokeWidth={2.6} />
    </button>
  );
}
