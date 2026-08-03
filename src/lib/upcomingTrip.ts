import type { Trip } from "../types/checklist";
import { daysUntil } from "./daysUntil";

export function getUpcomingTrip(trips: Trip[], now: Date = new Date()): Trip | null {
  const upcoming = trips
    .map((trip) => ({ trip, days: daysUntil(trip.startDate, now) }))
    .filter((entry): entry is { trip: Trip; days: number } => entry.days !== null && entry.days >= 0)
    .sort((a, b) => a.days - b.days);

  return upcoming[0]?.trip ?? null;
}
