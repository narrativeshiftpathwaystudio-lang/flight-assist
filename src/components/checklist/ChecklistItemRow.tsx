import type { ChecklistItem } from "../../types/checklist";

interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ChecklistItemRow({ item, onToggle, onRemove }: ChecklistItemRowProps) {
  return (
    <li className="group flex items-start gap-3 border-b border-sand-100 py-3 last:border-none">
      <button
        type="button"
        role="checkbox"
        aria-checked={item.checked}
        onClick={() => onToggle(item.id)}
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
          item.checked ? "border-forest-600 bg-forest-600" : "border-sand-300 bg-white hover:border-forest-500"
        }`}
      >
        {item.checked && (
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
            <path d="M3 8.5L6.2 11.5L13 4.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="flex-1">
        <button type="button" onClick={() => onToggle(item.id)} className="text-left">
          <span className={`text-sm ${item.checked ? "text-ink-soft line-through decoration-sand-300" : "text-ink"}`}>
            {item.label}
          </span>
        </button>
        {item.note && !item.checked && <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{item.note}</p>}
        {item.affiliateUrl && !item.checked && (
          <a
            href={item.affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="mt-1 flex w-fit items-center gap-1 text-xs font-medium text-clay-700 hover:text-clay-600 print:hidden"
          >
            Shop this
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path
                d="M6 4H4a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2M9 3h4v4M13 3L7 9"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        )}
      </div>

      <button
        type="button"
        onClick={() => onRemove(item.id)}
        aria-label={`Remove ${item.label}`}
        className="mt-0.5 shrink-0 rounded-full p-1 text-ink-soft opacity-0 transition-opacity hover:bg-sand-100 hover:text-ink group-hover:opacity-100 print:hidden"
      >
        <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
          <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </li>
  );
}
