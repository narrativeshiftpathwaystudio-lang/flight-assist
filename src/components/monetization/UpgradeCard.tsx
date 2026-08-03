interface UpgradeCardProps {
  onUpgrade: () => void;
  onCancel?: () => void;
}

const perks = [
  "Unlimited trips, saved side by side",
  "Print or save any checklist as a PDF, so it's with you even offline",
];

export function UpgradeCard({ onUpgrade, onCancel }: UpgradeCardProps) {
  return (
    <div className="rounded-2xl border border-clay-400/40 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">Flight Assist Premium</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">You've used your free trip</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft">
        The free plan keeps one trip's checklists at a time. Upgrade to plan multiple trips at once and keep past
        ones around for next time.
      </p>

      <ul className="mt-5 flex flex-col gap-2">
        {perks.map((perk) => (
          <li key={perk} className="flex items-start gap-2 text-sm text-ink">
            <svg viewBox="0 0 16 16" fill="none" className="mt-0.5 h-4 w-4 shrink-0 text-forest-600">
              <path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {perk}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={onUpgrade}
          className="rounded-full bg-clay-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-clay-600"
        >
          Upgrade to Premium
        </button>
        {onCancel && (
          <button onClick={onCancel} className="text-sm font-medium text-ink-soft underline decoration-sand-300 underline-offset-4 hover:text-ink">
            Not now
          </button>
        )}
      </div>
    </div>
  );
}
