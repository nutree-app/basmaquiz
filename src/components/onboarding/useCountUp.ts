"use client";

import { useEffect, useState } from "react";

const DURATION_MS = 900;

/** Ease-out cubic — fast start, gentle settle. */
function ease(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Animates a number up to its target the first time it is shown, then tracks
 * later changes instantly — so a stepper tap feels immediate rather than
 * re-running a 900 ms roll.
 *
 * Only the 0 → 1 progress is stored; the displayed figure is derived at render
 * time. A target that changes after the animation has finished therefore shows
 * at once with no extra state update, and every update happens inside a rAF
 * callback rather than synchronously in the effect body.
 *
 * Respects prefers-reduced-motion by jumping straight to the end.
 */
export function useCountUp(target: number): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const id = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(id);
    }

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const elapsed = Math.min(1, (now - start) / DURATION_MS);
      setProgress(elapsed);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    });

    return () => cancelAnimationFrame(frame);
    // Runs once: this is an entrance animation, not a reaction to the value.
    // Later target changes are picked up by the derived return below.
  }, []);

  return Math.round(target * ease(progress));
}
