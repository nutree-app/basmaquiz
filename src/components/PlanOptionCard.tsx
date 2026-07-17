export function PlanOptionCard({
  emoji,
  title,
  description,
  onSelect,
}: {
  emoji: string;
  title: string;
  description: string;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center transition-transform active:scale-[0.98] hover:border-muted"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow/15 text-lg">
        {emoji}
      </span>
      <h4 className="mt-3 text-base font-extrabold text-foreground">{title}</h4>
      <p className="mt-1 text-xs leading-5 text-muted">{description}</p>
    </button>
  );
}
