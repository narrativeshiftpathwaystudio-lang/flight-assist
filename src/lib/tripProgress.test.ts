import { describe, it, expect } from "vitest";
import { combinedProgress } from "./tripProgress";
import type { ChecklistItem, Trip } from "../types/checklist";

function item(checked: boolean): ChecklistItem {
  return { id: Math.random().toString(36), label: "x", category: "x", checked };
}

function makeTrip(overrides: Partial<Trip>): Trip {
  return {
    id: "t1",
    name: "Trip",
    templateId: "international",
    items: [],
    documentItems: [],
    researchItems: [],
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("combinedProgress", () => {
  it("returns zero totals for a trip with no items", () => {
    expect(combinedProgress(makeTrip({}))).toEqual({ packed: 0, total: 0 });
  });

  it("sums items across packing, documents, and research", () => {
    const trip = makeTrip({
      items: [item(true), item(false)],
      documentItems: [item(true)],
      researchItems: [item(false), item(false)],
    });
    expect(combinedProgress(trip)).toEqual({ packed: 2, total: 5 });
  });

  it("reports fully packed when every item across all lists is checked", () => {
    const trip = makeTrip({
      items: [item(true)],
      documentItems: [item(true)],
      researchItems: [item(true)],
    });
    expect(combinedProgress(trip)).toEqual({ packed: 3, total: 3 });
  });
});
