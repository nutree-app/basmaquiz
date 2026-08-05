"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TICK_SPACING = 14;
/** Every fifth tick is drawn tall, as on the app's target-weight ruler. */
const MAJOR_EVERY = 5;

/**
 * Horizontal tick ruler for the target weight.
 *
 * Same approach as the wheel — a scroll-snap container, so the ruler has real
 * flick momentum on touch. Forced to `dir="ltr"` because a numeric axis reads
 * left-to-right in the app screens, and because RTL scroll offsets are
 * reported inconsistently across browsers.
 */
export default function RulerPicker({
  min,
  max,
  step,
  value,
  onChange,
  label,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const framePending = useRef(false);
  const [pad, setPad] = useState(0);

  // Captured once, so the seeding effect stays independent of later scrolling.
  const [initialValue] = useState(value);

  const count = Math.round((max - min) / step) + 1;

  const scrollToValue = useCallback(
    (target: number, behavior: ScrollBehavior) => {
      const el = scrollerRef.current;
      if (!el) return;
      const index = Math.round((target - min) / step);
      el.scrollTo({ left: index * TICK_SPACING, behavior });
    },
    [min, step]
  );

  // Half the viewport of empty space at each end lets the first and last ticks
  // reach the centre indicator. ResizeObserver delivers the initial size on
  // observe(), so there is no need to measure separately up front.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(() => setPad(el.clientWidth / 2));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Seed the scroll position once the padding is known.
  const seeded = useRef(false);
  useEffect(() => {
    if (pad === 0 || seeded.current) return;
    seeded.current = true;
    scrollToValue(initialValue, "auto");
  }, [pad, scrollToValue, initialValue]);

  /* Plain function — see the note in WheelPicker: the handler is re-attached
     by React each render, so the closure is already current. */
  const handleScroll = () => {
    if (framePending.current) return;
    framePending.current = true;

    requestAnimationFrame(() => {
      framePending.current = false;
      const el = scrollerRef.current;
      if (!el || pad === 0) return;

      const index = Math.min(count - 1, Math.max(0, Math.round(el.scrollLeft / TICK_SPACING)));
      const next = Number((min + index * step).toFixed(2));
      if (next !== value) onChange(next);
    });
  };

  const activeIndex = Math.round((value - min) / step);

  return (
    <div className="relative">
      {/* Centre indicator the ticks slide beneath. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-10 h-[62px] w-[3px] -translate-x-1/2 rounded-full bg-ob-blue shadow-[0_0_14px_rgba(10,132,255,0.8)]"
      />

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        dir="ltr"
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
            event.preventDefault();
            scrollToValue(Math.max(min, value - step), "smooth");
          }
          if (event.key === "ArrowRight" || event.key === "ArrowUp") {
            event.preventDefault();
            scrollToValue(Math.min(max, value + step), "smooth");
          }
        }}
        className="scrollbar-hide ob-ruler-mask snap-x snap-mandatory overflow-x-scroll pb-1 pt-[14px] outline-none focus-visible:ring-2 focus-visible:ring-ob-blue/50"
      >
        <div
          className="flex items-start"
          style={{ paddingInline: pad, width: "max-content" }}
        >
          {Array.from({ length: count }, (_, index) => {
            const major = index % MAJOR_EVERY === 0;
            const distance = Math.abs(index - activeIndex);

            return (
              <span
                key={index}
                className="flex shrink-0 snap-center justify-center"
                style={{ width: TICK_SPACING }}
              >
                <span
                  className="rounded-full bg-ob-blue transition-opacity duration-200"
                  style={{
                    width: 2,
                    height: major ? 34 : 20,
                    opacity: distance > 16 ? 0.25 : Math.max(0.3, 1 - distance / 20),
                  }}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
