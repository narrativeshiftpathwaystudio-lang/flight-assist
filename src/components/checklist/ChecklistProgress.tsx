interface ChecklistProgressProps {
  packed: number;
  total: number;
}

export function ChecklistProgress({ packed, total }: ChecklistProgressProps) {
  const percent = total === 0 ? 0 : Math.round((packed / total) * 100);
  const message = total === 0 ? "" : percent === 100 ? "Everything's packed." : `${total - packed} item${total - packed === 1 ? "" : "s"} left`;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-sand-200 bg-white px-5 py-4 shadow-[var(--shadow-card)]">
      <div className="flex-1">
        <div className="flex items-baseline justify-between">
          <span className="text-sm font-medium text-ink">
            {packed} of {total} packed
          </span>
          <span className="text-xs text-ink-soft">{message}</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-sand-100">
          <div
            className="h-full rounded-full bg-forest-600 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
