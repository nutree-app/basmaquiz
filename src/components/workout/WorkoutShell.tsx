"use client";

import type { ReactNode } from "react";

/**
 * The frame the whole workout flow lives in.
 *
 * Deliberately a sibling of the onboarding's PhoneShell rather than the shared
 * AppShell: /success and the guide still render inside AppShell, so restyling
 * that would leak this dark treatment onto pages that must not change.
 *
 * `data-workout-flow` is what globals.css keys off to darken the document while
 * the flow is mounted.
 */
export function WorkoutShell({ children }: { children: ReactNode }) {
  return (
    <div
      data-workout-flow
      data-ob-accent="basmafit"
      className="relative flex min-h-[100dvh] w-full justify-center bg-ob-surround md:items-center md:p-6"
    >
      {/* Ambient glow behind the phone — desktop only, purely decorative. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <div className="animate-wk-pulse absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-wk-pink/10 blur-[130px]" />
        <div className="absolute left-1/2 top-[18%] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-wk-pink/10 blur-[120px]" />
      </div>

      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-ob-bg md:h-[min(100dvh-3rem,940px)] md:rounded-[44px] md:border md:border-white/10 md:shadow-[0_50px_130px_-40px_rgba(0,0,0,0.95)]">
        {children}
      </div>
    </div>
  );
}
