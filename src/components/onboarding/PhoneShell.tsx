"use client";

import type { ReactNode } from "react";

/**
 * The frame every screen lives in.
 *
 * On a phone it is simply the viewport. On a wide screen it becomes a
 * centred, phone-proportioned panel floating over a dark surround, so the
 * layout inside never has to change between the two.
 *
 * The `data-nutree-onboarding` attribute is what globals.css keys off to
 * darken the document body while the flow is mounted, and `data-ob-accent`
 * is what the shared step components read their accent colours from — the
 * workout flow renders this same shell under the Basmafit palette.
 */
export default function PhoneShell({
  children,
  accent = "nutree",
}: {
  children: ReactNode;
  /** Selects the accent/CTA token set defined in globals.css. */
  accent?: "nutree" | "basmafit";
}) {
  return (
    <div
      data-nutree-onboarding
      data-ob-accent={accent}
      className="relative flex min-h-[100dvh] w-full justify-center bg-ob-surround md:items-center md:p-6"
    >
      {/* Ambient glow behind the phone — desktop only, purely decorative. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block"
      >
        <div className="animate-ob-glow absolute left-1/2 top-1/2 h-[680px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ob-green/10 blur-[130px]" />
        <div className="absolute left-1/2 top-[18%] h-[320px] w-[520px] -translate-x-1/2 rounded-full bg-ob-blue/10 blur-[120px]" />
      </div>

      <div className="relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-ob-bg md:h-[min(100dvh-3rem,940px)] md:rounded-[44px] md:border md:border-white/10 md:shadow-[0_50px_130px_-40px_rgba(0,0,0,0.95)]">
        {children}
      </div>
    </div>
  );
}
