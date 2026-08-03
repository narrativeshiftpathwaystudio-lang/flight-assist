import type { Trip, TripDetails } from "../../types/checklist";
import { daysUntil } from "../../lib/daysUntil";

interface TripDetailsFieldsProps {
  trip: Trip;
  onUpdate: (patch: Partial<TripDetails>) => void;
}

const fieldClass =
  "rounded-lg border border-sand-200 px-3 py-2 text-sm text-ink focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500 print:border-none print:p-0 print:focus:ring-0";
const labelClass = "text-xs font-medium text-ink-soft";

function countdownLabel(days: number) {
  if (days === 0) return "You leave today!";
  if (days === 1) return "1 day until you leave";
  return `${days} days until you leave`;
}

export function TripDetailsFields({ trip, onUpdate }: TripDetailsFieldsProps) {
  const days = daysUntil(trip.startDate);

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Destination</span>
          <input
            type="text"
            value={trip.destination ?? ""}
            onChange={(e) => onUpdate({ destination: e.target.value })}
            placeholder="Tokyo, Japan"
            className={fieldClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Departure airport</span>
            <input
              type="text"
              value={trip.departureAirport ?? ""}
              onChange={(e) => onUpdate({ departureAirport: e.target.value })}
              placeholder="ORD"
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1.5">
            <span className={labelClass}>Arrival airport</span>
            <input
              type="text"
              value={trip.arrivalAirport ?? ""}
              onChange={(e) => onUpdate({ arrivalAirport: e.target.value })}
              placeholder="NRT"
              className={fieldClass}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Departure date</span>
          <input
            type="date"
            value={trip.startDate ?? ""}
            onChange={(e) => onUpdate({ startDate: e.target.value })}
            className={fieldClass}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={labelClass}>Return date</span>
          <input
            type="date"
            value={trip.endDate ?? ""}
            onChange={(e) => onUpdate({ endDate: e.target.value })}
            className={fieldClass}
          />
        </label>
      </div>

      {days !== null && days >= 0 && (
        <p className="mt-4 text-sm font-medium text-forest-700">{countdownLabel(days)}</p>
      )}
    </div>
  );
}
