import { describe, it, expect, beforeEach, vi } from "vitest";
import type { Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BeforeYouGo } from "./BeforeYouGo";
import { useAuth } from "../lib/useAuth";
import { useProfile } from "../lib/useProfile";

vi.mock("../lib/useAuth", () => ({ useAuth: vi.fn() }));
vi.mock("../lib/useProfile", () => ({ useProfile: vi.fn() }));

const mockedUseAuth = useAuth as Mock;
const mockedUseProfile = useProfile as Mock;

function setAuthState({ user, isPremium }: { user: { id: string } | null; isPremium: boolean }) {
  const upgrade = vi.fn(async () => {
    setAuthState({ user, isPremium: true });
  });
  const downgrade = vi.fn(async () => {
    setAuthState({ user, isPremium: false });
  });

  mockedUseAuth.mockReturnValue({
    user,
    loading: false,
    signUp: vi.fn(),
    signIn: vi.fn(),
    signOut: vi.fn(),
  });
  mockedUseProfile.mockReturnValue({ isPremium, loading: false, upgrade, downgrade });
}

describe("BeforeYouGo", () => {
  beforeEach(() => {
    localStorage.clear();
    setAuthState({ user: null, isPremium: false });
  });

  it("shows the template picker when there are no trips", () => {
    render(<BeforeYouGo />);
    expect(screen.getByText("Start your packing list")).toBeInTheDocument();
  });

  it("creates a trip and shows its checklist", () => {
    render(<BeforeYouGo />);
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    expect(screen.getByText("Packing")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Money & Cards" })).toBeInTheDocument();
    expect(screen.getByText("Travel documents")).toBeInTheDocument();
  });

  it("prompts sign-in (not the upgrade card) when a signed-out user hits the free plan limit", () => {
    render(<BeforeYouGo />);
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    fireEvent.click(screen.getByText("+ New trip"));

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.queryByText("You've used your free trip")).not.toBeInTheDocument();
    expect(screen.queryByText("Add another trip")).not.toBeInTheDocument();
  });

  it("shows the upgrade card (not the sign-in form) once signed in", () => {
    setAuthState({ user: { id: "user-1" }, isPremium: false });
    render(<BeforeYouGo />);
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    fireEvent.click(screen.getByText("+ New trip"));

    expect(screen.getByText("You've used your free trip")).toBeInTheDocument();
    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });

  it("upgrading removes the free plan trip limit", () => {
    setAuthState({ user: { id: "user-1" }, isPremium: false });
    render(<BeforeYouGo />);
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    fireEvent.click(screen.getByText("+ New trip"));
    fireEvent.click(screen.getByText("Upgrade to Premium"));

    fireEvent.click(screen.getByText("+ New trip"));
    expect(screen.getByText("Add another trip")).toBeInTheDocument();
  });

  it("only shows the PDF export link for premium users", () => {
    setAuthState({ user: { id: "user-1" }, isPremium: false });
    render(<BeforeYouGo />);
    fireEvent.click(screen.getByRole("button", { name: /International Trip/ }));
    expect(screen.queryByText("Print / Save as PDF")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("+ New trip"));
    fireEvent.click(screen.getByText("Upgrade to Premium"));
    expect(screen.getByText("Print / Save as PDF")).toBeInTheDocument();
  });
});
