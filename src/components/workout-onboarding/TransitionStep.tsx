"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 1900;

/**
 * One of the three automatic build screens (steps 17–19).
 *
 * Fills a ring over a fixed duration and then advances on its own — no button.
 * The step is still counted and still shows the progress header, so the back
 * control from the following screen returns to the previous *question* rather
 * than replaying an animation.
 */
export default function TransitionStep({
  emoji,
  title,
  subtitle,
  onDone,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      const id = window.setTimeout(onDone, 250);
      return () => window.clearTimeout(id);
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / DURATION_MS);
      setProgress(t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else onDone();
    });
    return () => cancelAnimationFrame(frame);
  }, [onDone]);

  const percent = Math.round(progress * 100);

  return (
    <div className="flex h-full flex-col items-center justify-center px-6 text-center">
      <div className="relative grid h-[132px] w-[132px] place-items-center">
        <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="60" cy="60" r="52" fill="none" stroke="#232a3d" strokeWidth="7" />
          <circle
            cx="60"
            cy="60"
            r="52"
            fill="none"
            stroke="#2BD96B"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * (1 - progress)}
            style={{ filter: "drop-shadow(0 0 8px rgba(43,217,107,0.6))" }}
          />
        </svg>
        <span aria-hidden className="animate-ob-check text-[42px] leading-none">
          {emoji}
        </span>
      </div>

      <p className="mt-5 text-[26px] font-extrabold tabular-nums text-ob-green" dir="ltr">
        {percent}%
      </p>

      <h2 className="animate-ob-rise mt-3 text-balance text-[24px] font-extrabold leading-tight text-white">
        {title}
      </h2>
      <p className="animate-ob-rise mx-auto mt-2.5 max-w-[320px] text-balance text-[15px] leading-[1.7] text-ob-text-dim">
        {subtitle}
      </p>
    </div>
  );
}
