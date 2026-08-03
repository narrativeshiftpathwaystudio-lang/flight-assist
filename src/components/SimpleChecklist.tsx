interface SimpleChecklistProps {
  items: string[];
  checked: Record<string, boolean>;
  onToggle: (label: string) => void;
}

export function SimpleChecklist({ items, checked, onToggle }: SimpleChecklistProps) {
  return (
    <ul className="flex flex-col divide-y divide-sand-100 overflow-hidden rounded-xl border border-sand-200 bg-white">
      {items.map((label) => {
        const isChecked = !!checked[label];
        return (
          <li key={label}>
            <button
              type="button"
              onClick={() => onToggle(label)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left"
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                  isChecked ? "border-forest-600 bg-forest-600" : "border-sand-300 bg-white"
                }`}
              >
                {isChecked && (
                  <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
                    <path
                      d="M3 8.5L6.2 11.5L13 4.5"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className={`text-sm ${isChecked ? "text-ink-soft line-through decoration-sand-300" : "text-ink"}`}>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
