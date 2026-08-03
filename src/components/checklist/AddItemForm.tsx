import { useState } from "react";

interface AddItemFormProps {
  categories: string[];
  onAdd: (label: string, category: string) => void;
}

export function AddItemForm({ categories, onAdd }: AddItemFormProps) {
  const [label, setLabel] = useState("");
  const [category, setCategory] = useState(categories[0] ?? "Other");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label, category);
    setLabel("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-dashed border-sand-300 bg-sand-50/60 p-5 sm:flex-row sm:items-center">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="Add something not on the list…"
        className="flex-1 rounded-lg border border-sand-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
      />
      {categories.length > 1 && (
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-lg border border-sand-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      )}
      <button
        type="submit"
        className="rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800"
      >
        Add item
      </button>
    </form>
  );
}
