export function ProgressBar({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percent = Math.min(100, Math.round(((current + 1) / total) * 100));

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-muted">
        <span>
          سؤال {current + 1} من {total}
        </span>
        <span>{percent}٪</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-card">
        <div
          className="h-full rounded-full bg-pink transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
