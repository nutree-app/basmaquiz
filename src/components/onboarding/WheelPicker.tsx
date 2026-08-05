"use client";

import { useEffect, useRef, useState } from "react";

const ITEM_HEIGHT = 58;
const VISIBLE_ROWS = 3;

/**
 * iOS-style value wheel.
 *
 * Built on a real scroll container with CSS scroll-snap rather than a
 * pointer-drag simulation: touch momentum, trackpad inertia, keyboard arrows
 * and screen-reader semantics all come from the platform, and the selection
 * settles on a row by itself.
 *
 * The component reads its starting position once, on mount. If the value set
 * changes underneath it (the metric/imperial switch), the parent remounts it
 * with a fresh `key` instead — simpler than reconciling scroll offsets.
 */
export default function WheelPicker({
  values,
  value,
  onChange,
  format,
  label,
}: {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  format: (value: number) => string;
  label: string;
}) {
  const listRef = useRef<HTMLDivElement>(null);
  const framePending = useRef(false);

  // Captured once, so the seeding effect below has no reactive dependencies.
  const [initialIndex] = useState(() => Math.max(0, values.indexOf(value)));
  const [active, setActive] = useState(initialIndex);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = initialIndex * ITEM_HEIGHT;
    // Position is seeded once; every later change arrives through scrolling.
  }, [initialIndex]);

  /*
    A plain function rather than a memoised one: React re-attaches the onScroll
    prop each render anyway, so reading the current props straight from the
    closure is both simpler and safer than mirroring them into refs.
  */
  const handleScroll = () => {
    if (framePending.current) return;
    framePending.current = true;

    requestAnimationFrame(() => {
      framePending.current = false;
      const el = listRef.current;
      if (!el) return;

      const index = Math.min(
        values.length - 1,
        Math.max(0, Math.round(el.scrollTop / ITEM_HEIGHT))
      );

      setActive((prev) => (prev === index ? prev : index));
      if (values[index] !== value) onChange(values[index]);
    });
  };

  const step = (delta: number) => {
    const el = listRef.current;
    if (!el) return;
    const next = Math.min(values.length - 1, Math.max(0, active + delta));
    el.scrollTo({ top: next * ITEM_HEIGHT, behavior: "smooth" });
  };

  return (
    <div className="relative" style={{ height: ITEM_HEIGHT * VISIBLE_ROWS }}>
      {/* Selection band behind the centre row. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 rounded-2xl bg-white/[0.035]"
        style={{ height: ITEM_HEIGHT }}
      />

      <div
        ref={listRef}
        onScroll={handleScroll}
        role="spinbutton"
        tabIndex={0}
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={values[0]}
        aria-valuemax={values[values.length - 1]}
        aria-valuetext={format(value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault();
            step(-1);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            step(1);
          }
        }}
        className="scrollbar-hide ob-wheel-mask h-full snap-y snap-mandatory overflow-y-scroll outline-none focus-visible:ring-2 focus-visible:ring-ob-blue/60 focus-visible:ring-offset-0"
        style={{ scrollPaddingBlock: ITEM_HEIGHT }}
      >
        <div style={{ paddingBlock: ITEM_HEIGHT }}>
          {values.map((item, index) => {
            const distance = Math.abs(index - active);
            const isActive = distance === 0;

            return (
              <div
                key={item}
                className="flex snap-center items-center justify-center"
                style={{ height: ITEM_HEIGHT }}
              >
                <span
                  className={`tabular-nums transition-all duration-200 ${
                    isActive
                      ? "text-[30px] font-extrabold text-ob-blue"
                      : "text-[23px] font-semibold text-white/25"
                  }`}
                  style={distance > 1 ? { opacity: 0.45 } : undefined}
                  dir="ltr"
                >
                  {format(item)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
