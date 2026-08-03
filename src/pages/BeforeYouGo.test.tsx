import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BeforeYouGo } from "./BeforeYouGo";
import { useAuth } from "../lib/useAuth";
import { useProfile } from "../lib/useProfile";

vi.mock("../lib/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../lib/useProfile", () => ({ useProfile: vi.fn() }));

const { mockFrom, setNextResult } = vi.hoisted(() => {
  let nextResult: unknown = { data: [], error: null };

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

vi.mock("../lib/supabaseClient", () => ({
  supabase: { from: mockFrom },
}));

const mockedUseAuth = useAuth as Mock;
const mockedUseProfile = useProfile as Mock;

function setAuthState({ user, isPremium }: { user: { id: string } | null; isPremium: boolean }) {
  mockedUseAuth.mockReturnValue({
    user,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  });
  const profile = { isPremium, loading: false, refresh: vi.fn(), startCheckout: vi.fn() };
  mockedUseProfile.mockReturnValue(profile);
  return profile;
}

function renderPage() {
  return render(
    <MemoryRouter>
      <BeforeYouGo />
    </MemoryRouter>,
  );
}

/** Cloud-mode tests start logged-in with a fresh (empty) account; wait past the initial fetch. */
async function renderSignedIn() {
  renderPage();
  await waitFor(() => expect(screen.queryByText("Loading your trips…")).not.toBeInTheDocument());
}

/** What the mocked Supabase insert should hand back when a cloud trip is created. */
function cloudTripRow(overrides: Partial<Record<string, unknown>> = {}) {
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

describe("BeforeYouGo", () => {
  beforeEach(() => {
    localStorage.clear();
    setNextResult({ data: [], error: null });
    setAuthState({ user: null, isPremium: false });
  });

  it("shows the template picker when there are no trips", () => {
    renderPage();
    expect(screen.getByText("Start your packing list")).toBeInTheDocument();
  });

  it("creates a trip and shows its checklist", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    expect(screen.getByText("Packing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Money & Cards" })).toBeInTheDocument();
    expect(screen.getByText("Travel documents")).toBeInTheDocument();
  });

  it("prompts sign-in (not the upgrade card) when a signed-out user hits the free plan limit", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    fireEvent.click(screen.getByText("+ New trip"));

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.queryByText("You've used your free trip")).not.toBeInTheDocument();
    expect(screen.queryByText("Add another trip")).not.toBeInTheDocument();
  });

  it("shows the upgrade card (not the sign-in form) once signed in", async () => {
    setAuthState({ user: { id: "user-1" }, isPremium: false });
    await renderSignedIn();
    setNextResult({ data: cloudTripRow(), error: null });
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    await waitFor(() => screen.getByText("+ New trip"));
    fireEvent.click(screen.getByText("+ New trip"));

    await waitFor(() => expect(screen.getByText("You've used your free trip")).toBeInTheDocument());
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });

  it("clicking Upgrade to Premium starts a Stripe checkout", async () => {
    const profile = setAuthState({ user: { id: "user-1" }, isPremium: false });
    await renderSignedIn();
    setNextResult({ data: cloudTripRow(), error: null });
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    await waitFor(() => screen.getByText("+ New trip"));
    fireEvent.click(screen.getByText("+ New trip"));
    await waitFor(() => screen.getByText(/Upgrade to Premium/));
    fireEvent.click(screen.getByText(/Upgrade to Premium/));

    expect(profile.startCheckout).toHaveBeenCalled();
  });

  it("premium users aren't limited to one trip", async () => {
    setAuthState({ user: { id: "user-1" }, isPremium: true });
    await renderSignedIn();
    setNextResult({ data: cloudTripRow(), error: null });
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    await waitFor(() => screen.getByText("+ New trip"));
    fireEvent.click(screen.getByText("+ New trip"));

    expect(screen.getByText("Add another trip")).toBeInTheDocument();
    expect(screen.queryByText("You've used your free trip")).not.toBeInTheDocument();
  });

  it("only shows the PDF export link for premium users", async () => {
    setAuthState({ user: { id: "user-1" }, isPremium: false });
    await renderSignedIn();
    setNextResult({ data: cloudTripRow(), error: null });
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    expect(screen.queryByText("Print / Save as PDF")).not.toBeInTheDocument();
  });

  it("shows the PDF export link for premium users", async () => {
    setAuthState({ user: { id: "user-1" }, isPremium: true });
    await renderSignedIn();
    setNextResult({ data: cloudTripRow(), error: null });
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    await waitFor(() => expect(screen.getByText("Print / Save as PDF")).toBeInTheDocument());
  });
});
