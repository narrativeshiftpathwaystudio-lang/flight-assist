import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useLocalChecklist } from "./useLocalChecklist";

describe("useLocalChecklist", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts with everything unchecked", () => {
    const { result } = renderHook(() => useLocalChecklist("test-key", ["a", "b", "c"]));
    expect(result.current.progress).toEqual({ packed: 0, total: 3 });
  });

  it("toggles an item and updates progress", () => {
    const { result } = renderHook(() => useLocalChecklist("test-key", ["a", "b"]));
    act(() => result.current.toggle("a"));
    expect(result.current.checked.a).toBe(true);
    expect(result.current.progress).toEqual({ packed: 1, total: 2 });
  });

  it("toggling twice reverts to unchecked", () => {
    const { result } = renderHook(() => useLocalChecklist("test-key", ["a"]));
    act(() => result.current.toggle("a"));
    act(() => result.current.toggle("a"));
    expect(result.current.checked.a).toBeFalsy();
  });

  it("persists checked state to localStorage under the given key", () => {
    const { result } = renderHook(() => useLocalChecklist("persist-key", ["a"]));
    act(() => result.current.toggle("a"));
    const stored = JSON.parse(localStorage.getItem("persist-key")!);
    expect(stored.a).toBe(true);
  });

  it("loads existing checked state from localStorage on mount", () => {
    localStorage.setItem("preloaded-key", JSON.stringify({ a: true }));
    const { result } = renderHook(() => useLocalChecklist("preloaded-key", ["a", "b"]));
    expect(result.current.progress).toEqual({ packed: 1, total: 2 });
  });
});
