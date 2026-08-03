import { describe, it, expect } from "vitest";
import { getUpcomingTrip } from "./upcomingTrip";
import type { Trip } from "../types/checklist";

const reference = new Date("2026-07-28T12:00:00");

function makeTrip(overrides: Partial<Trip>): Trip {
  return {
    id: Math.random().toString(36),
    name: "Trip",
    templateId: "international",
    items: [],
    documentItems: [],
    researchItems: [],
    createdAt: Date.now(),
    ...overrides,
  };
}

describe("getUpcomingTrip", () => {
  it("returns null when there are no trips", () => {
    expect(getUpcomingTrip([], reference)).toBeNull();
  });

  it("returns null when no trip has a start date", () => {
    const trips = [makeTrip({ name: "A" }), makeTrip({ name: "B" })];
    expect(getUpcomingTrip(trips, reference)).toBeNull();
  });

  it("returns null when all dated trips are in the past", () => {
    const trips = [makeTrip({ name: "A", startDate: "2026-07-01" })];
    expect(getUpcomingTrip(trips, reference)).toBeNull();
  });

  it("returns the only upcoming dated trip", () => {
    const trips = [makeTrip({ name: "A" }), makeTrip({ name: "B", startDate: "2026-08-07" })];
    expect(getUpcomingTrip(trips, reference)?.name).toBe("B");
  });

  it("picks the soonest of multiple upcoming trips", () => {
    const trips = [
      makeTrip({ name: "Far", startDate: "2026-09-01" }),
      makeTrip({ name: "Near", startDate: "2026-08-01" }),
      makeTrip({ name: "Mid", startDate: "2026-08-15" }),
    ];
    expect(getUpcomingTrip(trips, reference)?.name).toBe("Near");
  });

  it("treats today's departure as upcoming", () => {
    const trips = [makeTrip({ name: "Today", startDate: "2026-07-28" })];
    expect(getUpcomingTrip(trips, reference)?.name).toBe("Today");
  });
});
