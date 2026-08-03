import type { Trip } from "../types/checklist";

export function combinedProgress(trip: Trip) {
  const items = [...trip.items, ...trip.documentItems, ...trip.researchItems];
  const total = items.length;
  const packed = items.filter((i) => i.checked).length;
  return { packed, total };
}
