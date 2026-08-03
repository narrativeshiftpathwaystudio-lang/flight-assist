import { useState } from "react";
import { useLocalChecklist } from "../../lib/useLocalChecklist";
import { getBracket } from "../../lib/layoverBrackets";
import { SimpleChecklist } from "../SimpleChecklist";

export function LayoverPlanner() {
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const hasInput = hours !== "" || minutes !== "";
  const totalMinutes = (parseInt(hours, 10) || 0) * 60 + (parseInt(minutes, 10) || 0);
  const bracket = hasInput ? getBracket(totalMinutes) : null;

  const { checked, toggle } = useLocalChecklist(
    `traveler.layover.${bracket?.id ?? "none"}`,
    bracket?.todos ?? [],
  );

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">Try it</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">Layover time planner</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">
        Enter how long your layover is, and we'll tell you roughly how much room you have to work with.
      </p>

      <div className="mt-6 flex flex-wrap items-end gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">Hours</span>
          <input
            type="number"
            min="0"
            inputMode="numeric"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="0"
            className="w-24 rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-medium text-ink-soft">Minutes</span>
          <input
            type="number"
            min="0"
            max="59"
            inputMode="numeric"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            placeholder="0"
            className="w-24 rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
          />
        </label>
      </div>

      {bracket && (
        <div className="mt-6 rounded-xl bg-sand-50 p-5">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] text-forest-600">{bracket.label}</span>
          <p className="mt-1.5 text-sm leading-relaxed text-ink">{bracket.guidance}</p>
          <div className="mt-4">
            <SimpleChecklist items={bracket.todos} checked={checked} onToggle={toggle} />
          </div>
        </div>
      )}
    </div>
  );
}
