import { describe, expect, it } from "vitest";
import { TABS, getActiveTabHref } from "./tab-bar";

describe("bottom navigation", () => {
  it("has exactly three tabs: Trilha, Treinos, Perfil", () => {
    expect(TABS.map((t) => t.label)).toEqual(["Trilha", "Treinos", "Perfil"]);
  });

  it("no longer links to Amigos", () => {
    expect(TABS.some((t) => t.href === "/amigos" || t.label === "Amigos")).toBe(false);
  });

  it("detects the active tab for an exact match", () => {
    expect(getActiveTabHref("/treinos")).toBe("/treinos");
  });

  it("detects the active tab for a nested route", () => {
    expect(getActiveTabHref("/treinos/novo")).toBe("/treinos");
    expect(getActiveTabHref("/treinos/abc123/editar")).toBe("/treinos");
  });

  it("returns null for a route outside the tab bar (e.g. a public page)", () => {
    expect(getActiveTabHref("/login")).toBeNull();
  });
});
