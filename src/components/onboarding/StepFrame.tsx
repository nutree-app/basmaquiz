"use client";

import type { ReactNode } from "react";

/**
 * Shared skeleton for every screen: a scrolling body with an optional
 * centred title block, and a footer pinned to the bottom of the frame so the
 * primary button lands in the same place on every step — including the long
 * lists that scroll underneath it.
 */
export default function StepFrame({
  title,
  subtitle,
  center = false,
  footer,
  children,
}: {
  title?: string;
  subtitle?: string;
  /** Vertically centres the body — used by the single-control screens. */
  center?: boolean;
  footer?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="scrollbar-hide flex-1 overflow-y-auto overscroll-contain px-6">
        <div className={`flex min-h-full flex-col ${center ? "justify-center" : ""} pb-4`}>
          {title && (
            <header className="animate-ob-rise pt-6 text-center">
              <h1 className="text-balance text-[27px] font-extrabold leading-[1.3] text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="mx-auto mt-2 max-w-[330px] text-balance text-[15px] leading-[1.6] text-ob-text-dim">
                  {subtitle}
                </p>
              )}
            </header>
          )}

          {children}
        </div>
      </div>

      {footer && <div className="shrink-0 px-6 pb-6 pt-2">{footer}</div>}
    </div>
  );
}
