"use client";

import { useEffect, useRef } from "react";
import { Check } from "./icons";
import type { Choice } from "@/lib/onboarding/content";

/** Delay before an auto-advancing step moves on, so the tick is visible. */
const AUTO_ADVANCE_MS = 340;

/**
 * The radio-card list used by ten of the eighteen screens.
 *
 * In RTL the emoji sits on the trailing (right) edge, the label block reads
 * right-aligned beside it, and the radio dot is on the far left — matching
 * the app. Rows fade in one after another for a small sense of assembly.
 */
export default function ChoiceList<T extends string>({
  choices,
  value,
  onChange,
  onAutoAdvance,
  tiledEmoji = false,
  name,
}: {
  choices: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
  /** Supplied by steps that continue as soon as an option is chosen. */
  onAutoAdvance?: () => void;
  /** Renders the emoji inside a rounded tile, as on the goal screen. */
  tiledEmoji?: boolean;
  name: string;
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const select = (next: T) => {
    onChange(next);
    if (!onAutoAdvance) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(onAutoAdvance, AUTO_ADVANCE_MS);
  };

  return (
    <div role="radiogroup" aria-label={name} className="mt-6 flex flex-col gap-3">
      {choices.map((choice, index) => {
        const selected = value === choice.value;

        return (
          <button
            key={choice.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => select(choice.value)}
            style={{ animationDelay: `${60 + index * 45}ms` }}
            className={`animate-ob-rise flex w-full items-center gap-3.5 rounded-2xl border px-4 py-3.5 text-right transition-all duration-200 active:scale-[0.985] ${
              selected
                ? "border-ob-green/70 bg-ob-green/[0.09] shadow-[0_0_0_1px_rgba(43,217,107,0.35),0_12px_30px_-16px_rgba(43,217,107,0.6)]"
                : "border-white/[0.07] bg-ob-card hover:border-white/15"
            }`}
          >
            {/*
              DOM order is emoji → label → radio. Under RTL the first child
              lands on the right, which puts the emoji on the trailing edge and
              the radio dot on the far left, matching the app.
            */}
            <span
              aria-hidden
              className={
                tiledEmoji
                  ? "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ob-card-alt text-[22px]"
                  : "shrink-0 text-[24px] leading-none"
              }
            >
              {choice.emoji}
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[16px] font-bold leading-tight text-white">
                {choice.title}
              </span>
              {choice.caption && (
                <span className="mt-1 block text-[13.5px] leading-snug text-ob-text-dim">
                  {choice.caption}
                </span>
              )}
            </span>

            <span
              className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border-2 transition-colors duration-200 ${
                selected ? "border-ob-green bg-ob-green" : "border-white/25"
              }`}
            >
              {selected && (
                <Check className="animate-ob-check h-3 w-3 text-[#04240F]" strokeWidth={4} />
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}
