import { describe, it, expect } from "vitest";
import { getBracket } from "./layoverBrackets";

describe("getBracket", () => {
  it("classifies under 60 minutes as tight", () => {
    expect(getBracket(0).id).toBe("tight");
    expect(getBracket(40).id).toBe("tight");
    expect(getBracket(59).id).toBe("tight");
  });

  it("classifies 60 to 179 minutes as comfortable", () => {
    expect(getBracket(60).id).toBe("comfortable");
    expect(getBracket(150).id).toBe("comfortable");
    expect(getBracket(179).id).toBe("comfortable");
  });

  it("classifies 180 minutes and up as long", () => {
    expect(getBracket(180).id).toBe("long");
    expect(getBracket(500).id).toBe("long");
  });

  it("always returns at least one todo for the bracket", () => {
    expect(getBracket(30).todos.length).toBeGreaterThan(0);
    expect(getBracket(120).todos.length).toBeGreaterThan(0);
    expect(getBracket(300).todos.length).toBeGreaterThan(0);
  });
});
