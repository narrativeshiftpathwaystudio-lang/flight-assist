import { packingTemplates } from "../../data/packingTemplates";

interface TemplatePickerProps {
  onSelect: (templateId: string) => void;
  heading?: string;
  description?: string;
}

export function TemplatePicker({
  onSelect,
  heading = "Start your packing list",
  description = "Pick the option closest to your trip. You'll get a starter list you can check off, edit, or add to — nothing here is fixed.",
}: TemplatePickerProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-navy-900">{heading}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {packingTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template.id)}
            className="group flex flex-col items-start rounded-2xl border border-sand-200 bg-white p-6 text-left shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-forest-500/40 hover:shadow-[var(--shadow-card-hover)]"
          >
            <h3 className="font-serif text-lg text-navy-900">{template.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{template.description}</p>
            <span className="mt-4 text-xs font-medium uppercase tracking-[0.08em] text-clay-700">
              {template.items.length} starter items
            </span>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 transition-transform group-hover:translate-x-0.5">
              Use this list
              <span aria-hidden="true">→</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
