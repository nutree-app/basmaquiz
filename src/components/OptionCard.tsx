export function OptionCard({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-right text-base font-bold transition-all active:scale-[0.98] ${
        selected
          ? "glow-pink border-pink bg-pink/10 text-foreground"
          : "border-border bg-card text-foreground hover:border-muted"
      }`}
    >
      <span>{label}</span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected ? "border-pink bg-pink" : "border-border"
        }`}
      >
        {selected && (
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
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
    </button>
  );
}
