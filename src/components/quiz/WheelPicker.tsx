"use client";

import { useCallback, useEffect, useRef } from "react";

const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

export function WheelPicker({
  values,
  value,
  onChange,
  suffix,
}: {
  values: number[];
  value: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextScroll = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const indexOfValue = useCallback(
    (v: number) => {
      const idx = values.indexOf(v);
      return idx === -1 ? 0 : idx;
    },
    [values]
  );

  // ضبط موضع التمرير الأولي على القيمة الحالية عند التركيب فقط
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    skipNextScroll.current = true;
    container.scrollTop = indexOfValue(value) * ITEM_HEIGHT;
    const t = setTimeout(() => {
      skipNextScroll.current = false;
    }, 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = useCallback(() => {
    if (skipNextScroll.current) return;
    const container = containerRef.current;
    if (!container) return;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      const rawIndex = Math.round(container.scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.min(Math.max(rawIndex, 0), values.length - 1);
      const nextValue = values[clampedIndex];

      container.scrollTo({ top: clampedIndex * ITEM_HEIGHT, behavior: "smooth" });

      if (typeof nextValue === "number" && !Number.isNaN(nextValue) && nextValue !== value) {
        onChange(nextValue);
      }
    }, 110);
  }, [value, values, onChange]);

  function handleItemClick(v: number) {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: indexOfValue(v) * ITEM_HEIGHT, behavior: "smooth" });
    onChange(v);
  }

  return (
    <div className="relative mx-auto w-full max-w-[180px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-10 h-11 -translate-y-1/2 rounded-xl border-2 border-pink bg-pink/5"
      />
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="scrollbar-hide relative overflow-y-scroll [scroll-snap-type:y_mandatory]"
        style={{ height: CONTAINER_HEIGHT, WebkitOverflowScrolling: "touch" }}
      >
        <div style={{ height: PADDING }} aria-hidden />
        {values.map((v) => {
          const distance = Math.abs(v - value);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.22;
          const scale = distance === 0 ? 1 : 0.85;

          return (
            <button
              key={v}
              type="button"
              onClick={() => handleItemClick(v)}
              style={{
                height: ITEM_HEIGHT,
                scrollSnapAlign: "center",
                opacity,
                transform: `scale(${scale})`,
              }}
              className="flex w-full items-center justify-center text-xl font-black text-foreground transition-all duration-150"
            >
              {v}
              {suffix ? (
                <span className="mr-1 text-sm font-bold text-muted">{suffix}</span>
              ) : null}
            </button>
          );
        })}
        <div style={{ height: PADDING }} aria-hidden />
      </div>
    </div>
  );
}
