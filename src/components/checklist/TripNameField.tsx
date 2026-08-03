import { useEffect, useState } from "react";

interface TripNameFieldProps {
  value: string;
  onChange: (name: string) => void;
}

export function TripNameField({ value, onChange }: TripNameFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  function commit() {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onChange(trimmed);
    else setDraft(value);
  }

  return (
    <input
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.currentTarget.blur();
      }}
      aria-label="Trip name"
      className="-ml-1 rounded border border-transparent bg-transparent px-1 font-serif text-2xl text-navy-900 hover:border-sand-300 focus:border-forest-500 focus:outline-none"
      style={{ width: `${Math.max(draft.length, 6)}ch` }}
    />
  );
}
