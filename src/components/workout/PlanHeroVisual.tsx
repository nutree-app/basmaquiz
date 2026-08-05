"use client";

/**
 * The welcome screen's centrepiece: a progress ring that draws itself on entry,
 * a glowing flame at the core, and nutrition + fitness icons orbiting around it.
 *
 * Built from SVG and CSS transforms rather than a bitmap so it stays crisp,
 * scales with the viewport, and respects prefers-reduced-motion (globals.css
 * neutralises the animations inside [data-workout-flow]).
 *
 * Each satellite sits on a wrapper rotated to its angle and is then pushed out
 * along the radius; the wrapper spins, and the icon counter-spins at the same
 * rate so it travels the circle while staying upright.
 */

const RADIUS = 78;
const STROKE = 9;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** Fraction of the ring that ends up filled. */
const PROGRESS = 0.74;

interface Satellite {
  emoji: string;
  /** Degrees clockwise from 12 o'clock. */
  angle: number;
  /** Distance from the centre, in px at the base size. */
  distance: number;
  /** Seconds, so the icons bob out of sync with each other. */
  floatDuration: number;
  delay: number;
}

const SATELLITES: Satellite[] = [
  { emoji: "🥩", angle: 0, distance: 118, floatDuration: 4.4, delay: 0 },
  { emoji: "🥑", angle: 60, distance: 126, floatDuration: 5.2, delay: 0.35 },
  { emoji: "🍞", angle: 120, distance: 116, floatDuration: 4.8, delay: 0.7 },
  { emoji: "🏋️‍♀️", angle: 180, distance: 128, floatDuration: 5.6, delay: 1.05 },
  { emoji: "🥦", angle: 240, distance: 118, floatDuration: 4.6, delay: 1.4 },
  { emoji: "💪", angle: 300, distance: 124, floatDuration: 5.0, delay: 1.75 },
];

export function PlanHeroVisual() {
  const dashTarget = CIRCUMFERENCE * (1 - PROGRESS);

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[300px] min-[380px]:max-w-[320px]"
      aria-hidden
    >
      {/* Soft glow behind everything. */}
      <div className="animate-wk-pulse absolute inset-[18%] rounded-full bg-wk-pink/25 blur-3xl" />

      {/* Ring. Rotated so the stroke starts at 12 o'clock. */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="#232a3d"
          strokeWidth={STROKE}
        />
        <circle
          cx="100"
          cy="100"
          r={RADIUS}
          fill="none"
          stroke="url(#wk-ring-gradient)"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          className="animate-wk-ring"
          style={
            {
              "--wk-ring-circumference": CIRCUMFERENCE,
              "--wk-ring-target": dashTarget,
              strokeDashoffset: dashTarget,
              filter: "drop-shadow(0 0 8px rgba(214,75,120,0.7))",
            } as React.CSSProperties
          }
        />
        <defs>
          <linearGradient id="wk-ring-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff8fb0" />
            <stop offset="100%" stopColor="#d64b78" />
          </linearGradient>
        </defs>
      </svg>

      {/* Flame core. */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="animate-wk-pop grid h-[86px] w-[86px] place-items-center rounded-full border border-wk-pink/40 bg-[#1a0f15] shadow-[0_0_36px_-6px_rgba(214,75,120,0.8)]">
          <span className="animate-wk-float text-[40px] leading-none">🔥</span>
        </div>
      </div>

      {/* Orbiting nutrition + fitness icons. */}
      <div className="animate-wk-orbit absolute inset-0">
        {SATELLITES.map((s, i) => (
          <div
            key={s.emoji}
            className="absolute left-1/2 top-1/2 h-0 w-0"
            style={{ transform: `rotate(${s.angle}deg) translateY(-${s.distance}px)` }}
          >
            {/* Cancels the parent's spin so the emoji never turns upside down. */}
            <div className="animate-wk-orbit-rev">
              <div
                className="animate-wk-float"
                style={{ animationDuration: `${s.floatDuration}s`, animationDelay: `${s.delay}s` }}
              >
                <span
                  className="animate-wk-pop grid h-[46px] w-[46px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-2xl border border-white/10 bg-ob-card text-[22px] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.9)]"
                  style={{ animationDelay: `${0.25 + i * 0.09}s` }}
                >
                  {s.emoji}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
