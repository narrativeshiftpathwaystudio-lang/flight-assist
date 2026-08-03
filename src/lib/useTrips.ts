import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { ChecklistItem, Trip, TripDetails } from "../types/checklist";
import { packingTemplates } from "../data/packingTemplates";
import { documentTemplates } from "../data/documentTemplates";
import { researchTemplates } from "../data/researchTemplates";
import { supabase } from "./supabaseClient";

const STORAGE_KEY = "traveler.trips.v1";

type ListField = "items" | "documentItems" | "researchItems";

interface TripsState {
  trips: Trip[];
  activeTripId: string | null;
}

interface TripRow {
  id: string;
  user_id: string;
  name: string;
  template_id: string;
  destination: string | null;
  departure_airport: string | null;
  arrival_airport: string | null;
  start_date: string | null;
  end_date: string | null;
  items: ChecklistItem[];
  document_items: ChecklistItem[];
  research_items: ChecklistItem[];
  created_at: string;
}

function loadLocalState(): TripsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as TripsState;
  } catch {
    // ignore malformed storage and fall through to default
  }
  return { trips: [], activeTripId: null };
}

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function seedItems(
  seeds: Array<{ label: string; category?: string; note?: string; affiliateUrl?: string }>,
  category: string,
) {
  return seeds.map((seed) => ({
    id: makeId(),
    label: seed.label,
    category: seed.category ?? category,
    note: seed.note,
    affiliateUrl: seed.affiliateUrl,
    checked: false,
  }));
}

function listProgress(items: ChecklistItem[] | undefined) {
  const total = items?.length ?? 0;
  const packed = items?.filter((i) => i.checked).length ?? 0;
  return { packed, total };
}

function rowToTrip(row: TripRow): Trip {
  return {
    id: row.id,
    name: row.name,
    templateId: row.template_id,
    destination: row.destination ?? undefined,
    departureAirport: row.departure_airport ?? undefined,
    arrivalAirport: row.arrival_airport ?? undefined,
    startDate: row.start_date ?? undefined,
    endDate: row.end_date ?? undefined,
    items: row.items ?? [],
    documentItems: row.document_items ?? [],
    researchItems: row.research_items ?? [],
    createdAt: new Date(row.created_at).getTime(),
  };
}

function tripToRow(trip: Omit<Trip, "id" | "createdAt">, userId: string) {
  return {
    user_id: userId,
    name: trip.name,
    template_id: trip.templateId,
    destination: trip.destination ?? null,
    departure_airport: trip.departureAirport ?? null,
    arrival_airport: trip.arrivalAirport ?? null,
    start_date: trip.startDate ?? null,
    end_date: trip.endDate ?? null,
    items: trip.items,
    document_items: trip.documentItems,
    research_items: trip.researchItems,
  };
}

function newTripBase(templateId: string, existingCount: number) {
  const chosen = packingTemplates.find((t) => t.id === templateId);
  if (!chosen) return null;
  const name = existingCount === 0 ? chosen.name : `${chosen.name} ${existingCount + 1}`;
  return {
    name,
    templateId,
    items: seedItems(chosen.items, ""),
    documentItems: seedItems(documentTemplates[templateId] ?? [], "Documents"),
    researchItems: seedItems(researchTemplates[templateId] ?? [], "Research"),
  };
}

export function useTrips(user: User | null) {
  const [state, setState] = useState<TripsState>(() => (user ? { trips: [], activeTripId: null } : loadLocalState()));
  const [loading, setLoading] = useState(!!user);
  const [localTripsToMigrate, setLocalTripsToMigrate] = useState<Trip[]>([]);

  // Guests: keep every state change mirrored to localStorage, exactly as before.
  useEffect(() => {
    if (user) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, user]);

  // Load the right source whenever auth state changes.
  useEffect(() => {
    if (!user) {
      setState(loadLocalState());
      setLoading(false);
      setLocalTripsToMigrate([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    supabase
      .from("trips")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (cancelled) return;
        const trips = ((data as TripRow[] | null) ?? []).map(rowToTrip);
        setState({ trips, activeTripId: trips[0]?.id ?? null });
        setLoading(false);

        const local = loadLocalState();
        setLocalTripsToMigrate(trips.length === 0 ? local.trips : []);
      });

    return () => {
      cancelled = true;
    };
  }, [user]);

  const activeTrip = state.trips.find((t) => t.id === state.activeTripId) ?? null;
  const template = activeTrip ? packingTemplates.find((t) => t.id === activeTrip.templateId) ?? null : null;

  function syncTrip(trip: Trip) {
    if (!user) return;
    supabase
      .from("trips")
      .update(tripToRow(trip, user.id))
      .eq("id", trip.id)
      .then(({ error }) => {
        if (error) console.error("Failed to sync trip", error);
      });
  }

  async function createTrip(templateId: string) {
    const existingCount = state.trips.filter((t) => t.templateId === templateId).length;
    const base = newTripBase(templateId, existingCount);
    if (!base) return;

    if (user) {
      const { data, error } = await supabase
        .from("trips")
        .insert(tripToRow(base, user.id))
        .select()
        .single();
      if (error || !data) {
        console.error("Failed to create trip", error);
        return;
      }
      const trip = rowToTrip(data as TripRow);
      setState((prev) => ({ trips: [...prev.trips, trip], activeTripId: trip.id }));
    } else {
      const trip: Trip = { ...base, id: makeId(), createdAt: Date.now() };
      setState((prev) => ({ trips: [...prev.trips, trip], activeTripId: trip.id }));
    }
  }

  function selectTrip(id: string) {
    setState((prev) => ({ ...prev, activeTripId: id }));
  }

  function renameTrip(id: string, name: string) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, name };
        syncTrip(updated);
        return updated;
      }),
    }));
  }

  function updateTripDetails(id: string, patch: Partial<TripDetails>) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => {
        if (t.id !== id) return t;
        const updated = { ...t, ...patch };
        syncTrip(updated);
        return updated;
      }),
    }));
  }

  function deleteTrip(id: string) {
    setState((prev) => {
      const trips = prev.trips.filter((t) => t.id !== id);
      const activeTripId = prev.activeTripId === id ? (trips[0]?.id ?? null) : prev.activeTripId;
      return { trips, activeTripId };
    });
    if (user) {
      supabase
        .from("trips")
        .delete()
        .eq("id", id)
        .then(({ error }) => {
          if (error) console.error("Failed to delete trip", error);
        });
    }
  }

  function updateList(field: ListField, updater: (items: ChecklistItem[]) => ChecklistItem[]) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => {
        if (t.id !== prev.activeTripId) return t;
        const updated = { ...t, [field]: updater(t[field]) };
        syncTrip(updated);
        return updated;
      }),
    }));
  }

  function makeListActions(field: ListField) {
    return {
      toggle: (id: string) =>
        updateList(field, (items) => items.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))),
      add: (label: string, category: string) => {
        const trimmed = label.trim();
        if (!trimmed) return;
        updateList(field, (items) => [
          ...items,
          { id: makeId(), label: trimmed, category, checked: false, custom: true },
        ]);
      },
      remove: (id: string) => updateList(field, (items) => items.filter((item) => item.id !== id)),
    };
  }

  async function migrateLocalTrips() {
    if (!user || localTripsToMigrate.length === 0) return;
    const inserted: Trip[] = [];
    for (const trip of localTripsToMigrate) {
      const { data, error } = await supabase.from("trips").insert(tripToRow(trip, user.id)).select().single();
      if (!error && data) inserted.push(rowToTrip(data as TripRow));
    }
    setState({ trips: inserted, activeTripId: inserted[0]?.id ?? null });
    setLocalTripsToMigrate([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  function dismissMigration() {
    setLocalTripsToMigrate([]);
  }

  const packingActions = makeListActions("items");
  const documentActions = makeListActions("documentItems");
  const researchActions = makeListActions("researchItems");

  return {
    trips: state.trips,
    activeTrip,
    template,
    loading,
    localTripsToMigrate,
    migrateLocalTrips,
    dismissMigration,
    createTrip,
    selectTrip,
    renameTrip,
    updateTripDetails,
    deleteTrip,
    toggleItem: packingActions.toggle,
    addItem: packingActions.add,
    removeItem: packingActions.remove,
    toggleDocumentItem: documentActions.toggle,
    addDocumentItem: documentActions.add,
    removeDocumentItem: documentActions.remove,
    toggleResearchItem: researchActions.toggle,
    addResearchItem: researchActions.add,
    removeResearchItem: researchActions.remove,
    progress: listProgress(activeTrip?.items),
    documentProgress: listProgress(activeTrip?.documentItems),
    researchProgress: listProgress(activeTrip?.researchItems),
  };
}
