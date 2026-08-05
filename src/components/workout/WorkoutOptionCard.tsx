"use client";

import type { ChoiceOption } from "@/lib/quiz-steps";

/**
 * The selectable card used by every choice step.
 *
 * Matches the onboarding's ChoiceList row for row — tile on the trailing (right)
 * edge under RTL, label block beside it, radio dot on the far left — with the
 * pink accent in place of the onboarding's green.
 */
export function WorkoutOptionCard({
  option,
  selected,
  onClick,
  index,
}: {
  option: ChoiceOption;
  selected: boolean;
  onClick: () => void;
  index: number;
}) {
  const hasTile = Boolean(option.emoji || option.badge);

  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      style={{ animationDelay: `${60 + index * 45}ms` }}
      className={`animate-ob-rise flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-right transition-all duration-200 active:scale-[0.985] ${
        selected
          ? "border-wk-pink/70 bg-wk-pink/[0.10] shadow-[0_0_0_1px_rgba(180,70,105,0.35),0_12px_30px_-16px_rgba(180,70,105,0.65)]"
          : "border-white/[0.07] bg-ob-card hover:border-white/15"
      }`}
    >
      {/* Tile first so it lands on the right in RTL, as in the onboarding. */}
      {hasTile && (
        <span
          aria-hidden
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
            selected && option.badge
              ? "bg-wk-pink/20 text-wk-pink-text"
              : "bg-ob-card-alt text-white/80"
          }`}
        >
          {option.badge ? (
            <span className="text-[19px] font-extrabold leading-none">{option.badge}</span>
          ) : (
            // Emoji keeps its own colours — the tile behind it stays neutral.
            <span className="text-[24px] leading-none">{option.emoji}</span>
          )}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block text-[16px] font-bold leading-tight text-white">
          {option.label}
        </span>
        {option.helper && (
          <span className="mt-1 block text-[13.5px] leading-snug text-ob-text-dim">
            {option.helper}
          </span>
        )}
      </span>

      <span
        className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
          selected ? "border-wk-pink bg-wk-pink" : "border-white/25"
        }`}
      >
        {selected && (
          <svg viewBox="0 0 24 24" fill="none" className="animate-ob-check h-3 w-3" aria-hidden>
            <path
              d="M5 13l4 4L19 7"
              stroke="white"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
