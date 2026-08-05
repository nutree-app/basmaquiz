"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Pink primary button + square back control, mirroring the onboarding footer.
 *
 * Kept separate from components/buttons.tsx on purpose: that module's yellow
 * `primaryButtonClass` is still used by /home-workout-guide, so it must not
 * change.
 */
export function WorkoutPrimaryButton({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`h-[54px] w-full rounded-[18px] bg-wk-pink text-[17px] font-bold text-white shadow-[0_10px_30px_-10px_rgba(180,70,105,0.75)] transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-ob-card-alt disabled:text-ob-text-faint disabled:shadow-none ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** In RTL forward is left, so the chevron pointing right reads as "back". */
export function WorkoutBackButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      aria-label="رجوع"
      className="grid h-[54px] w-[62px] shrink-0 place-items-center rounded-[18px] bg-ob-card-alt text-white/70 transition-colors duration-200 hover:text-white active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden>
        <path
          d="M9 5l7 7-7 7"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

/** Body + pinned footer, so the CTA sits in the same place on every step. */
export function WorkoutFrame({
  title,
  helper,
  children,
  footer,
}: {
  title?: string;
  helper?: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
        <div className="flex min-h-full flex-col pb-4">
          {title && (
            <header className="animate-ob-rise pt-6 text-center">
              <h2 className="text-balance text-[27px] font-extrabold leading-[1.3] text-white">
                {title}
              </h2>
              {helper && (
                <p className="mx-auto mt-2 max-w-[330px] text-balance text-[15px] leading-[1.6] text-ob-text-dim">
                  {helper}
                </p>
              )}
            </header>
          )}
          {children}
        </div>
      </div>

      <div className="safe-bottom shrink-0 px-6 pb-6 pt-2">{footer}</div>
    </div>
  );
}
