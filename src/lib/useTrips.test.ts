import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTrips } from "./useTrips";

describe("useTrips", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no trips and no active trip", () => {
    const { result } = renderHook(() => useTrips());
    expect(result.current.trips).toHaveLength(0);
    expect(result.current.activeTrip).toBeNull();
  });

  it("creates a trip from a template and makes it active", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.activeTrip?.name).toBe("International Trip");
    expect(result.current.activeTrip?.templateId).toBe("international");
  });

  it("seeds packing, document, and research items on creation", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const trip = result.current.activeTrip!;
    expect(trip.items.length).toBeGreaterThan(0);
    expect(trip.documentItems.length).toBeGreaterThan(0);
    expect(trip.researchItems.length).toBeGreaterThan(0);
    expect(trip.items.every((i) => !i.checked)).toBe(true);
  });

  it("names a second trip of the same template distinctly", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    act(() => result.current.createTrip("international"));
    const names = result.current.trips.map((t) => t.name);
    expect(names).toEqual(["International Trip", "International Trip 2"]);
  });

  it("toggles a packing item without affecting document or research items", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const itemId = result.current.activeTrip!.items[0].id;
    act(() => result.current.toggleItem(itemId));
    expect(result.current.activeTrip!.items[0].checked).toBe(true);
    expect(result.current.progress.packed).toBe(1);
    expect(result.current.documentProgress.packed).toBe(0);
    expect(result.current.researchProgress.packed).toBe(0);
  });

  it("adds and removes a custom packing item", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("domestic-short"));
    const before = result.current.activeTrip!.items.length;
    act(() => result.current.addItem("Neck pillow", "Clothing"));
    expect(result.current.activeTrip!.items.length).toBe(before + 1);
    const added = result.current.activeTrip!.items.find((i) => i.label === "Neck pillow")!;
    expect(added.custom).toBe(true);
    act(() => result.current.removeItem(added.id));
    expect(result.current.activeTrip!.items.length).toBe(before);
  });

  it("ignores blank input when adding an item", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("domestic-short"));
    const before = result.current.activeTrip!.items.length;
    act(() => result.current.addItem("   ", "Clothing"));
    expect(result.current.activeTrip!.items.length).toBe(before);
  });

  it("switches the active trip with selectTrip", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    act(() => result.current.createTrip("domestic-short"));
    const [first] = result.current.trips;
    act(() => result.current.selectTrip(first.id));
    expect(result.current.activeTrip?.id).toBe(first.id);
  });

  it("renames a trip", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const id = result.current.activeTrip!.id;
    act(() => result.current.renameTrip(id, "Tokyo, June 2026"));
    expect(result.current.activeTrip?.name).toBe("Tokyo, June 2026");
  });

  it("has no trip details set on creation", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const trip = result.current.activeTrip!;
    expect(trip.destination).toBeUndefined();
    expect(trip.startDate).toBeUndefined();
    expect(trip.endDate).toBeUndefined();
    expect(trip.departureAirport).toBeUndefined();
    expect(trip.arrivalAirport).toBeUndefined();
  });

  it("updates trip details independently of other trips", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const id = result.current.activeTrip!.id;
    act(() => result.current.createTrip("domestic-short"));

    act(() =>
      result.current.updateTripDetails(id, {
        destination: "Tokyo, Japan",
        departureAirport: "ORD",
        arrivalAirport: "NRT",
        startDate: "2026-08-07",
        endDate: "2026-08-20",
      }),
    );

    const updated = result.current.trips.find((t) => t.id === id)!;
    expect(updated.destination).toBe("Tokyo, Japan");
    expect(updated.departureAirport).toBe("ORD");
    expect(updated.arrivalAirport).toBe("NRT");
    expect(updated.startDate).toBe("2026-08-07");
    expect(updated.endDate).toBe("2026-08-20");

    const other = result.current.trips.find((t) => t.id !== id)!;
    expect(other.destination).toBeUndefined();
  });

  it("applies a partial trip details patch without clearing other fields", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const id = result.current.activeTrip!.id;

    act(() => result.current.updateTripDetails(id, { destination: "Tokyo, Japan" }));
    act(() => result.current.updateTripDetails(id, { startDate: "2026-08-07" }));

    expect(result.current.activeTrip?.destination).toBe("Tokyo, Japan");
    expect(result.current.activeTrip?.startDate).toBe("2026-08-07");
  });

  it("deleting the active trip falls back to another trip", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const first = result.current.activeTrip!.id;
    act(() => result.current.createTrip("domestic-short"));
    act(() => result.current.deleteTrip(result.current.activeTrip!.id));
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.activeTrip?.id).toBe(first);
  });

  it("deleting the only trip clears the active trip", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const id = result.current.activeTrip!.id;
    act(() => result.current.deleteTrip(id));
    expect(result.current.trips).toHaveLength(0);
    expect(result.current.activeTrip).toBeNull();
  });

  it("persists trips to localStorage", () => {
    const { result } = renderHook(() => useTrips());
    act(() => result.current.createTrip("international"));
    const stored = JSON.parse(localStorage.getItem("traveler.trips.v1")!);
    expect(stored.trips).toHaveLength(1);
    expect(stored.activeTripId).toBe(result.current.activeTrip!.id);
  });
});
