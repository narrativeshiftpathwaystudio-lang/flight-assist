import type { Trip } from "../../types/checklist";

interface TripSwitcherProps {
  trips: Trip[];
  activeTripId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function TripSwitcher({ trips, activeTripId, onSelect, onNew }: TripSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {trips.map((trip) => {
        const total = trip.items.length;
        const packed = trip.items.filter((item) => item.checked).length;
        const active = trip.id === activeTripId;
        return (
          <button
            key={trip.id}
            onClick={() => onSelect(trip.id)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-navy-900 text-cream"
                : "border border-sand-200 bg-white text-ink-soft hover:border-forest-500/40 hover:text-ink"
            }`}
          >
            {trip.name}
            <span className={active ? "ml-2 text-xs text-sand-200" : "ml-2 text-xs text-ink-soft/70"}>
              {packed}/{total}
            </span>
          </button>
        );
      })}
      <button
        onClick={onNew}
        className="rounded-full border border-dashed border-sand-300 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-forest-500/50 hover:text-ink"
      >
        + New trip
      </button>
    </div>
  );
}
