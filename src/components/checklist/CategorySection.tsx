import type { ChecklistItem } from "../../types/checklist";
import { ChecklistItemRow } from "./ChecklistItemRow";
import { categoryIcons, TagIcon } from "../icons";

interface CategorySectionProps {
  category: string;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
}

export function CategorySection({ category, items, onToggle, onRemove }: CategorySectionProps) {
  if (items.length === 0) return null;
  const packed = items.filter((i) => i.checked).length;
  const Icon = categoryIcons[category] ?? TagIcon;

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-baseline justify-between">
        <h3 className="flex items-center gap-2.5 font-serif text-lg text-navy-900">
          <Icon className="h-5 w-5 shrink-0 text-clay-600" />
          {category}
        </h3>
        <span className="text-xs text-ink-soft">
          {packed}/{items.length}
        </span>
      </div>
      <ul className="mt-2">
        {items.map((item) => (
          <ChecklistItemRow key={item.id} item={item} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </ul>
    </div>
  );
}
