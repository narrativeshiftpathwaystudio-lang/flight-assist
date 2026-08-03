import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import type { User } from "@supabase/supabase-js";

const { mockSingle, mockEq, mockSelect, mockUpdateEq, mockUpdate, mockFrom } = vi.hoisted(() => {
  const mockSingle = vi.fn();
  const mockEq = vi.fn(() => ({ single: mockSingle }));
  const mockSelect = vi.fn(() => ({ eq: mockEq }));
  const mockUpdateEq = vi.fn();
  const mockUpdate = vi.fn(() => ({ eq: mockUpdateEq }));
  const mockFrom = vi.fn(() => ({ select: mockSelect, update: mockUpdate }));
  return { mockSingle, mockEq, mockSelect, mockUpdateEq, mockUpdate, mockFrom };
});

vi.mock("./supabaseClient", () => ({
  supabase: { from: mockFrom },
}));

import { useProfile } from "./useProfile";

const user = { id: "user-1" } as User;

describe("useProfile", () => {
  beforeEach(() => {
    mockFrom.mockClear();
    mockSelect.mockClear();
    mockEq.mockClear();
    mockSingle.mockReset().mockResolvedValue({ data: { is_premium: false } });
    mockUpdate.mockClear();
    mockUpdateEq.mockReset().mockResolvedValue({ error: null });
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

  it("upgrade sets isPremium and writes it to the profiles table", async () => {
    const { result } = renderHook(() => useProfile(user));
    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.upgrade();
    });

    expect(result.current.isPremium).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({ is_premium: true });
    expect(mockUpdateEq).toHaveBeenCalledWith("id", "user-1");
  });

  it("downgrade sets isPremium false and writes it to the profiles table", async () => {
    mockSingle.mockResolvedValue({ data: { is_premium: true } });
    const { result } = renderHook(() => useProfile(user));
    await waitFor(() => expect(result.current.isPremium).toBe(true));

    await act(async () => {
      await result.current.downgrade();
    });

    expect(result.current.isPremium).toBe(false);
    expect(mockUpdate).toHaveBeenCalledWith({ is_premium: false });
  });
});
