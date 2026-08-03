import { useLocalChecklist } from "../../lib/useLocalChecklist";
import { SimpleChecklist } from "../SimpleChecklist";

interface QuickChecklistToolProps {
  eyebrow: string;
  title: string;
  intro: string;
  storageKey: string;
  items: string[];
}

export function QuickChecklistTool({ eyebrow, title, intro, storageKey, items }: QuickChecklistToolProps) {
  const { checked, toggle, progress } = useLocalChecklist(storageKey, items);

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">{eyebrow}</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">{intro}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
        {progress.packed} of {progress.total} checked
      </p>
      <div className="mt-2">
        <SimpleChecklist items={items} checked={checked} onToggle={toggle} />
      </div>
    </div>
  );
}
