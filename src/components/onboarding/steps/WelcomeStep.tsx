"use client";

import { MapPin } from "../icons";
import { NUTREE_DOWNLOAD_URL } from "@/lib/onboarding/config";
import { welcome } from "@/lib/onboarding/content";

/** Screen 1 — the food grid, the promise, and the only full-width pill button. */
export default function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex h-full flex-col px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        {/* Fixed left-to-right so the fruit order matches the app exactly. */}
        <div dir="ltr" className="flex flex-col gap-4">
          {welcome.emojiRows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-3.5">
              {row.map((emoji, index) => (
                <span
                  key={emoji}
                  aria-hidden
                  style={{ animationDelay: `${(rowIndex * 5 + index) * 55}ms` }}
                  className="animate-ob-rise text-[40px] leading-none"
                >
                  {emoji}
                </span>
              ))}
            </div>
          ))}
        </div>

        <h1
          style={{ animationDelay: "560ms" }}
          className="animate-ob-rise mt-12 text-balance text-center text-[32px] font-extrabold leading-[1.25] text-white"
        >
          {welcome.title}
        </h1>
        <p
          style={{ animationDelay: "630ms" }}
          className="animate-ob-rise mt-2.5 text-center text-[16px] text-ob-text-dim"
        >
          {welcome.subtitle}
        </p>

        <div
          style={{ animationDelay: "700ms" }}
          className="animate-ob-rise mt-8 flex w-full items-center justify-center gap-2 rounded-[22px] bg-ob-green-deep px-5 py-4"
        >
          <MapPin className="h-[18px] w-[18px] shrink-0 text-ob-green-text" strokeWidth={2.4} />
          <span className="text-[16px] font-bold text-ob-green-text">{welcome.badge}</span>
        </div>
      </div>

      <div className="shrink-0 pb-6 pt-4">
        <button
          type="button"
          onClick={onNext}
          className="relative h-[60px] w-full overflow-hidden rounded-full bg-ob-green text-[18px] font-extrabold text-[#04240F] shadow-[0_14px_38px_-12px_rgba(43,217,107,0.75)] transition-transform duration-200 active:scale-[0.98]"
        >
          {welcome.cta}
          {/* Slow sheen so the primary action reads as alive, not decorated. */}
          <span
            aria-hidden
            className="animate-ob-sheen pointer-events-none absolute inset-y-0 w-1/3 bg-linear-to-r from-transparent via-white/25 to-transparent"
          />
        </button>

        <p className="mt-4 text-center text-[14px] text-ob-text-dim">
          {welcome.footerPrompt}{" "}
          <a
            href={NUTREE_DOWNLOAD_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-ob-green"
          >
            {welcome.footerAction}
          </a>
        </p>
      </div>
    </div>
  );
}
