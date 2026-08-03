import type { Trip } from "../../types/checklist";

interface MigrationPromptProps {
  trips: Trip[];
  onMigrate: () => void;
  onDismiss: () => void;
}

export function MigrationPrompt({ trips, onMigrate, onDismiss }: MigrationPromptProps) {
  return (
    <div className="rounded-2xl border border-clay-400/40 bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <span className="text-xs font-semibold uppercase tracking-[0.1em] text-clay-700">Found on this device</span>
      <h2 className="mt-2 font-serif text-2xl text-navy-900">
        {trips.length === 1 ? "You have 1 trip saved locally" : `You have ${trips.length} trips saved locally`}
      </h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
        These were saved before you signed in, so they're only on this device. Move them to your account to keep
        them and see them anywhere you sign in.
      </p>
      <ul className="mt-4 flex flex-col gap-1">
        {trips.map((trip) => (
          <li key={trip.id} className="text-sm text-ink">
            {trip.name}
            {trip.destination ? ` — ${trip.destination}` : ""}
          </li>
        ))}
      </ul>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={onMigrate}
          className="rounded-full bg-navy-900 px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-navy-800"
        >
          Move to my account
        </button>
        <button
          onClick={onDismiss}
          className="text-sm font-medium text-ink-soft underline decoration-sand-300 underline-offset-4 hover:text-ink"
        >
          Not now
        </button>
      </div>
    </div>
  );
}
