import { describe, it, expect } from "vitest";
import { daysUntil } from "./daysUntil";

const reference = new Date("2026-07-28T12:00:00");

describe("daysUntil", () => {
  it("returns null when no date is given", () => {
    expect(daysUntil(undefined, reference)).toBeNull();
  });

  it("returns null for an unparseable date", () => {
    expect(daysUntil("not-a-date", reference)).toBeNull();
  });

  it("returns 0 for today", () => {
    expect(daysUntil("2026-07-28", reference)).toBe(0);
  });

  it("returns a positive count for a future date", () => {
    expect(daysUntil("2026-08-07", reference)).toBe(10);
  });

  it("returns a negative count for a past date", () => {
    expect(daysUntil("2026-07-20", reference)).toBe(-8);
  });
});
