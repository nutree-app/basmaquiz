"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = ["تحليل إجاباتك", "تحديد هدفك", "مراجعة مستوى نشاطك", "تجهيز خطتك المناسبة"];

// مراحل تعبئة النسبة: كل مرحلة تغطي ربع الشريط، والربع الأخير أبطأ عمدًا
// لإحساس تحضير طبيعي (0-25%: 1ث، 25-50%: 1ث، 50-75%: 1ث، 75-100%: 2ث)
const PERCENT_SEGMENTS = [
  { from: 0, to: 25, durationMs: 1000 },
  { from: 25, to: 50, durationMs: 1000 },
  { from: 50, to: 75, durationMs: 1000 },
  { from: 75, to: 100, durationMs: 2000 },
];
// مدة إبقاء حالة 100% ظاهرة قبل الانتقال لصفحة النتيجة
const HOLD_AT_100_MS = 300;

function percentAtElapsed(elapsedMs: number): number {
  let segmentStart = 0;
  for (const segment of PERCENT_SEGMENTS) {
    const segmentEnd = segmentStart + segment.durationMs;
    if (elapsedMs < segmentEnd) {
      const segmentProgress = (elapsedMs - segmentStart) / segment.durationMs;
      return segment.from + (segment.to - segment.from) * segmentProgress;
    }
    segmentStart = segmentEnd;
  }
  return 100;
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [percent, setPercent] = useState(0);
  const startRef = useRef<number | null>(null);
  const frameRef = useRef<number | null>(null);
  const holdTimeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function tick(timestamp: number) {
      if (cancelled) return;
      if (startRef.current === null) startRef.current = timestamp;

      const elapsed = timestamp - startRef.current;
      const nextPercent = Math.min(100, Math.round(percentAtElapsed(elapsed)));
      setPercent((prev) => (nextPercent > prev ? nextPercent : prev));

      if (nextPercent >= 100) {
        holdTimeoutRef.current = window.setTimeout(() => {
          if (cancelled || completedRef.current) return;
          completedRef.current = true;
          onComplete();
        }, HOLD_AT_100_MS);
        return;
      }

      frameRef.current = requestAnimationFrame(tick);
    }

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (holdTimeoutRef.current !== null) window.clearTimeout(holdTimeoutRef.current);
    };
  }, [onComplete]);

  const activeStepIndex = Math.min(STEPS.length - 1, Math.floor(percent / 25));

  return (
    <div className="animate-fade-in flex flex-1 flex-col items-center justify-center gap-10 px-6 text-center">
      <div className="flex w-full max-w-xs flex-col items-center gap-4">
        <span className="text-5xl font-black tabular-nums text-pink">{percent}٪</span>
        <p className="text-sm font-bold text-muted">جاري تجهيز خطتك المناسبة…</p>

        <div className="h-2 w-full overflow-hidden rounded-full bg-card">
          <div
            className="h-full rounded-full bg-pink"
            style={{ width: `${percent}%`, transition: "width 80ms linear" }}
          />
        </div>
      </div>

      <div className="flex w-full max-w-xs flex-col items-start gap-4">
        {STEPS.map((step, index) => {
          const isComplete = percent >= (index + 1) * 25;
          const isActive = !isComplete && index === activeStepIndex;

          return (
            <div key={step} className="flex w-full items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  isComplete
                    ? "border-pink bg-pink"
                    : isActive
                      ? "border-pink bg-transparent"
                      : "border-border bg-transparent"
                }`}
              >
                {isComplete && (
                  <svg
                    key={`check-${index}`}
                    className="animate-check-in"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span
                className={`text-sm font-bold transition-colors duration-300 ${
                  isComplete || isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
