const MIN_WEIGHT = 35;
const MAX_WEIGHT = 180;

function StepperRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card px-5 py-4">
      <span className="text-sm font-bold text-muted">{label}</span>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="زيادة"
          onClick={() => onChange(Math.min(MAX_WEIGHT, value + 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-xl font-bold text-foreground transition-transform active:scale-90"
        >
          +
        </button>
        <span className="w-16 text-center text-lg font-black text-foreground">
          {value} <span className="text-xs font-bold text-muted">كجم</span>
        </span>
        <button
          type="button"
          aria-label="إنقاص"
          onClick={() => onChange(Math.max(MIN_WEIGHT, value - 1))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-card-soft text-xl font-bold text-foreground transition-transform active:scale-90"
        >
          −
        </button>
      </div>
    </div>
  );
}

export function WeightStepper({
  currentWeight,
  targetWeight,
  onChangeCurrent,
  onChangeTarget,
}: {
  currentWeight: number;
  targetWeight: number;
  onChangeCurrent: (value: number) => void;
  onChangeTarget: (value: number) => void;
}) {
  const diff = targetWeight - currentWeight;

  return (
    <div className="flex flex-col gap-4">
      <StepperRow label="وزنك الحالي" value={currentWeight} onChange={onChangeCurrent} />
      <StepperRow label="وزنك المستهدف" value={targetWeight} onChange={onChangeTarget} />

      {diff !== 0 && (
        <p className="text-center text-sm font-bold text-pink animate-fade-in">
          التغيير المتوقع: {diff > 0 ? "+" : ""}
          {diff} كجم
        </p>
      )}
    </div>
  );
}
