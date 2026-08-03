import { useEffect, useState } from "react";

function loadChecked(storageKey: string): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    // ignore malformed storage
  }
  return {};
}

export function useLocalChecklist(storageKey: string, items: string[]) {
  const [checked, setChecked] = useState<Record<string, boolean>>(() => loadChecked(storageKey));

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [storageKey, checked]);

  function toggle(label: string) {
    setChecked((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  const total = items.length;
  const packed = items.filter((label) => checked[label]).length;

  return { checked, toggle, progress: { packed, total } };
}
