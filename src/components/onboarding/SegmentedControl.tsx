"use client";

/** The متري / إمبراطوري switch — a sliding pill over two equal segments. */
export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
}) {
  const activeIndex = Math.max(0, options.findIndex((option) => option.value === value));

  return (
    <div
      role="tablist"
      aria-label={label}
      className="relative mx-auto flex w-[220px] rounded-full bg-ob-card-alt p-1"
    >
      {/*
        Positioned with a logical inset rather than translateX: `translate` is
        always physically rightward, whereas inset-inline-start follows the
        reading direction, so the pill lands under the right segment in RTL
        without a direction-aware sign.
      */}
      <span
        aria-hidden
        className="absolute inset-y-1 rounded-full bg-[var(--ob-accent)] transition-[inset-inline-start] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          width: `calc((100% - 0.5rem) / ${options.length})`,
          insetInlineStart: `calc(0.25rem + ${activeIndex} * (100% - 0.5rem) / ${options.length})`,
        }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="tab"
          aria-selected={value === option.value}
          onClick={() => onChange(option.value)}
          className={`relative z-10 flex-1 rounded-full py-2 text-[14px] font-bold transition-colors duration-200 ${
            value === option.value ? "text-[var(--ob-accent-contrast)]" : "text-ob-text-dim"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
