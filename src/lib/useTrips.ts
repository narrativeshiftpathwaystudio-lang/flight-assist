import { useEffect, useState } from "react";
import type { ChecklistItem, Trip, TripDetails } from "../types/checklist";
import { packingTemplates } from "../data/packingTemplates";
import { documentTemplates } from "../data/documentTemplates";
import { researchTemplates } from "../data/researchTemplates";

const STORAGE_KEY = "traveler.trips.v1";

type ListField = "items" | "documentItems" | "researchItems";

interface TripsState {
  trips: Trip[];
  activeTripId: string | null;
}

function loadState(): TripsState {
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

export function useTrips() {
  const [state, setState] = useState<TripsState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const activeTrip = state.trips.find((t) => t.id === state.activeTripId) ?? null;
  const template = activeTrip ? packingTemplates.find((t) => t.id === activeTrip.templateId) ?? null : null;

  function createTrip(templateId: string) {
    const chosen = packingTemplates.find((t) => t.id === templateId);
    if (!chosen) return;
    const existingCount = state.trips.filter((t) => t.templateId === templateId).length;
    const name = existingCount === 0 ? chosen.name : `${chosen.name} ${existingCount + 1}`;
    const trip: Trip = {
      id: makeId(),
      name,
      templateId,
      createdAt: Date.now(),
      items: seedItems(chosen.items, ""),
      documentItems: seedItems(documentTemplates[templateId] ?? [], "Documents"),
      researchItems: seedItems(researchTemplates[templateId] ?? [], "Research"),
    };
    setState((prev) => ({ trips: [...prev.trips, trip], activeTripId: trip.id }));
  }

  function selectTrip(id: string) {
    setState((prev) => ({ ...prev, activeTripId: id }));
  }

  function renameTrip(id: string, name: string) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === id ? { ...t, name } : t)),
    }));
  }

  function updateTripDetails(id: string, patch: Partial<TripDetails>) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
  }

  function deleteTrip(id: string) {
    setState((prev) => {
      const trips = prev.trips.filter((t) => t.id !== id);
      const activeTripId = prev.activeTripId === id ? (trips[0]?.id ?? null) : prev.activeTripId;
      return { trips, activeTripId };
    });
  }

  function updateList(field: ListField, updater: (items: ChecklistItem[]) => ChecklistItem[]) {
    setState((prev) => ({
      ...prev,
      trips: prev.trips.map((t) => (t.id === prev.activeTripId ? { ...t, [field]: updater(t[field]) } : t)),
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

  const packingActions = makeListActions("items");
  const documentActions = makeListActions("documentItems");
  const researchActions = makeListActions("researchItems");

  return {
    trips: state.trips,
    activeTrip,
    template,
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
