import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const { mockGetSession, mockOnAuthStateChange, mockSignUp, mockSignInWithPassword, mockSignOut } = vi.hoisted(
  () => ({
    mockGetSession: vi.fn(),
    mockOnAuthStateChange: vi.fn(),
    mockSignUp: vi.fn(),
    mockSignInWithPassword: vi.fn(),
    mockSignOut: vi.fn(),
  }),
);

vi.mock("./supabaseClient", () => ({
  supabase: {
    auth: {
      getSession: mockGetSession,
      onAuthStateChange: mockOnAuthStateChange,
      signUp: mockSignUp,
      signInWithPassword: mockSignInWithPassword,
      signOut: mockSignOut,
    },
  },
}));

import { useAuth } from "./useAuth";

describe("useAuth", () => {
  beforeEach(() => {
    mockGetSession.mockReset().mockResolvedValue({ data: { session: null } });
    mockOnAuthStateChange
      .mockReset()
      .mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } });
    mockSignUp.mockReset();
    mockSignInWithPassword.mockReset();
    mockSignOut.mockReset();
  });

  it("starts loading, then resolves to no user when there's no session", async () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toBeNull();
  });

  it("picks up an existing session on mount", async () => {
    const fakeUser = { id: "user-1", email: "a@b.com" };
    mockGetSession.mockResolvedValue({ data: { session: { user: fakeUser } } });

    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.user).toEqual(fakeUser);
  });

  it("delegates signUp, signIn, and signOut to the supabase client", () => {
    const { result } = renderHook(() => useAuth());

    result.current.signUp("a@b.com", "password123");
    expect(mockSignUp).toHaveBeenCalledWith({ email: "a@b.com", password: "password123" });

    result.current.signIn("a@b.com", "password123");
    expect(mockSignInWithPassword).toHaveBeenCalledWith({ email: "a@b.com", password: "password123" });

    result.current.signOut();
    expect(mockSignOut).toHaveBeenCalled();
  });
});
