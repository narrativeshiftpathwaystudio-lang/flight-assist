import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

const { mockSingle, mockEq, mockSelect, mockFrom, mockGetSession } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect }));
  const mockGetSession = vi.fn();
  return { mockSingle, mockEq, mockSelect, mockFrom, mockGetSession };
});

vi.mock("./supabaseClient", () => ({
  supabase: { from: mockFrom, auth: { getSession: mockGetSession } },
}));

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

import { useProfile } from "./useProfile";

const user = { id: "user-1" } as User;

describe("useProfile", () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockEq.mockClear();
    mockSingle.mockReset().mockResolvedValue({ data: { is_premium: false } });
    mockGetSession.mockReset().mockResolvedValue({ data: { session: { access_token: "token-123" } } });
    mockFetch.mockReset().mockResolvedValue({ json: async () => ({ url: "https://checkout.stripe.com/session" }) });
  });

  it("defaults to not premium and not loading when there's no user", () => {
    const { result } = renderHook(() => useProfile(null));
    expect(result.current.isPremium).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it("fetches is_premium for the given user", async () => {
    mockSingle.mockResolvedValue({ data: { is_premium: true } });
    const { result } = renderHook(() => useProfile(user));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isPremium).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("profiles");
    expect(mockEq).toHaveBeenCalledWith("id", "user-1");
  });

  it("refresh re-fetches is_premium from the profiles table", async () => {
    const { result } = renderHook(() => useProfile(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    mockSingle.mockResolvedValue({ data: { is_premium: true } });
    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.isPremium).toBe(true);
  });

  it("startCheckout posts the access token and redirects to the returned url", async () => {
    const { result } = renderHook(() => useProfile(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.startCheckout();
    });

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/create-checkout-session",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer token-123" },
      }),
    );
  });
});
