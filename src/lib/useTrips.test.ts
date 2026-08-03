import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

const { mockFrom, setNextResult } = vi.hoisted(() => {
  let nextResult: unknown = { data: null, error: null };

  function makeBuilder(): Record<string, unknown> {
    const builder: Record<string, unknown> = {};
    for (const method of ["select", "insert", "update", "delete", "eq", "order"]) {
      builder[method] = () => builder;
    }
    builder.single = () => Promise.resolve(nextResult);
    builder.then = (resolve: (v: unknown) => unknown, reject?: (e: unknown) => unknown) =>
      Promise.resolve(nextResult).then(resolve, reject);
    return builder;
  }

  return {
    mockFrom: () => makeBuilder(),
    setNextResult: (result: unknown) => {
      nextResult = result;
    },
  };
});

vi.mock("./supabaseClient", () => ({
  supabase: { from: mockFrom },
}));

import { useTrips } from "./useTrips";

describe("useTrips (guest / localStorage mode)", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with no trips and no active trip", () => {
    const { result } = renderHook(() => useTrips(null));
    expect(result.current.trips).toHaveLength(0);
    expect(result.current.activeTrip).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("creates a trip from a template and makes it active", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.activeTrip?.name).toBe("International Trip");
    expect(result.current.activeTrip?.templateId).toBe("international");
  });

  it("seeds packing, document, and research items on creation", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const trip = result.current.activeTrip!;
    expect(trip.items.length).toBeGreaterThan(0);
    expect(trip.documentItems.length).toBeGreaterThan(0);
    expect(trip.researchItems.length).toBeGreaterThan(0);
    expect(trip.items.every((i) => !i.checked)).toBe(true);
  });

  it("names a second trip of the same template distinctly", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    await act(async () => {
      await result.current.createTrip("international");
    });
    const names = result.current.trips.map((t) => t.name);
    expect(names).toEqual(["International Trip", "International Trip 2"]);
  });

  it("toggles a packing item without affecting document or research items", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const itemId = result.current.activeTrip!.items[0].id;
    act(() => result.current.toggleItem(itemId));
    expect(result.current.activeTrip!.items[0].checked).toBe(true);
    expect(result.current.progress.packed).toBe(1);
    expect(result.current.documentProgress.packed).toBe(0);
    expect(result.current.researchProgress.packed).toBe(0);
  });

  it("adds and removes a custom packing item", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("domestic-short");
    });
    const before = result.current.activeTrip!.items.length;
    act(() => result.current.addItem("Neck pillow", "Clothing"));
    expect(result.current.activeTrip!.items.length).toBe(before + 1);
    const added = result.current.activeTrip!.items.find((i) => i.label === "Neck pillow")!;
    expect(added.custom).toBe(true);
    act(() => result.current.removeItem(added.id));
    expect(result.current.activeTrip!.items.length).toBe(before);
  });

  it("ignores blank input when adding an item", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("domestic-short");
    });
    const before = result.current.activeTrip!.items.length;
    act(() => result.current.addItem("   ", "Clothing"));
    expect(result.current.activeTrip!.items.length).toBe(before);
  });

  it("switches the active trip with selectTrip", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    await act(async () => {
      await result.current.createTrip("domestic-short");
    });
    const [first] = result.current.trips;
    act(() => result.current.selectTrip(first.id));
    expect(result.current.activeTrip?.id).toBe(first.id);
  });

  it("renames a trip", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const id = result.current.activeTrip!.id;
    act(() => result.current.renameTrip(id, "Tokyo, June 2026"));
    expect(result.current.activeTrip?.name).toBe("Tokyo, June 2026");
  });

  it("has no trip details set on creation", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const trip = result.current.activeTrip!;
    expect(trip.destination).toBeUndefined();
    expect(trip.startDate).toBeUndefined();
    expect(trip.endDate).toBeUndefined();
    expect(trip.departureAirport).toBeUndefined();
    expect(trip.arrivalAirport).toBeUndefined();
  });

  it("updates trip details independently of other trips", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const id = result.current.activeTrip!.id;
    await act(async () => {
      await result.current.createTrip("domestic-short");
    });

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

  it("applies a partial trip details patch without clearing other fields", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const id = result.current.activeTrip!.id;

    act(() => result.current.updateTripDetails(id, { destination: "Tokyo, Japan" }));
    act(() => result.current.updateTripDetails(id, { startDate: "2026-08-07" }));

    expect(result.current.activeTrip?.destination).toBe("Tokyo, Japan");
    expect(result.current.activeTrip?.startDate).toBe("2026-08-07");
  });

  it("deleting the active trip falls back to another trip", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const first = result.current.activeTrip!.id;
    await act(async () => {
      await result.current.createTrip("domestic-short");
    });
    act(() => result.current.deleteTrip(result.current.activeTrip!.id));
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.activeTrip?.id).toBe(first);
  });

  it("deleting the only trip clears the active trip", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const id = result.current.activeTrip!.id;
    act(() => result.current.deleteTrip(id));
    expect(result.current.trips).toHaveLength(0);
    expect(result.current.activeTrip).toBeNull();
  });

  it("persists trips to localStorage", async () => {
    const { result } = renderHook(() => useTrips(null));
    await act(async () => {
      await result.current.createTrip("international");
    });
    const stored = JSON.parse(localStorage.getItem("traveler.trips.v1")!);
    expect(stored.trips).toHaveLength(1);
    expect(stored.activeTripId).toBe(result.current.activeTrip!.id);
  });
});

describe("useTrips (cloud / Supabase mode)", () => {
  const user = { id: "user-1" } as User;

  beforeEach(() => {
    localStorage.clear();
    setNextResult({ data: [], error: null });
  });

  function cloudTrip(overrides: Partial<Record<string, unknown>> = {}) {
    return {
      id: "trip-1",
      user_id: "user-1",
      name: "International Trip",
      template_id: "international",
      destination: null,
      departure_airport: null,
      arrival_airport: null,
      start_date: null,
      end_date: null,
      items: [],
      document_items: [],
      research_items: [],
      created_at: "2026-08-01T00:00:00.000Z",
      ...overrides,
    };
  }

  it("starts loading, then fetches trips for the logged-in user", async () => {
    setNextResult({ data: [cloudTrip()], error: null });

    const { result } = renderHook(() => useTrips(user));
    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.trips).toHaveLength(1);
    expect(result.current.trips[0].name).toBe("International Trip");
    expect(result.current.activeTrip?.id).toBe("trip-1");
  });

  it("creates a trip via a Supabase insert when logged in", async () => {
    const { result } = renderHook(() => useTrips(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    setNextResult({ data: cloudTrip({ id: "new-trip-id" }), error: null });
    await act(async () => {
      await result.current.createTrip("international");
    });

    expect(result.current.trips).toHaveLength(1);
    expect(result.current.activeTrip?.id).toBe("new-trip-id");
  });

  it("offers to migrate local trips when the account has none yet", async () => {
    localStorage.setItem(
      "traveler.trips.v1",
      JSON.stringify({
        trips: [
          {
            id: "local-1",
            name: "Local Trip",
            templateId: "international",
            items: [],
            documentItems: [],
            researchItems: [],
            createdAt: Date.now(),
          },
        ],
        activeTripId: "local-1",
      }),
    );

    const { result } = renderHook(() => useTrips(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.localTripsToMigrate).toHaveLength(1);
    expect(result.current.localTripsToMigrate[0].name).toBe("Local Trip");
  });

  it("does not offer migration when the account already has trips", async () => {
    localStorage.setItem(
      "traveler.trips.v1",
      JSON.stringify({
        trips: [
          {
            id: "local-1",
            name: "Local Trip",
            templateId: "international",
            items: [],
            documentItems: [],
            researchItems: [],
            createdAt: Date.now(),
          },
        ],
        activeTripId: "local-1",
      }),
    );
    setNextResult({ data: [cloudTrip()], error: null });

    const { result } = renderHook(() => useTrips(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.localTripsToMigrate).toHaveLength(0);
  });

  it("dismissing the migration prompt clears it without uploading anything", async () => {
    localStorage.setItem(
      "traveler.trips.v1",
      JSON.stringify({
        trips: [
          {
            id: "local-1",
            name: "Local Trip",
            templateId: "international",
            items: [],
            documentItems: [],
            researchItems: [],
            createdAt: Date.now(),
          },
        ],
        activeTripId: "local-1",
      }),
    );

    const { result } = renderHook(() => useTrips(user));
    await waitFor(() => expect(result.current.localTripsToMigrate).toHaveLength(1));

    act(() => result.current.dismissMigration());
    expect(result.current.localTripsToMigrate).toHaveLength(0);
    expect(result.current.trips).toHaveLength(0);
  });
});
