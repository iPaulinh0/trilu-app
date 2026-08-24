import { describe, expect, it } from "vitest";
import { sanitizeNextPath } from "./sanitize-next";

describe("sanitizeNextPath", () => {
  it("accepts a plain internal path", () => {
    expect(sanitizeNextPath("/treinos")).toBe("/treinos");
  });

  it("accepts a nested internal path with a query string", () => {
    expect(sanitizeNextPath("/treinos/novo?nome=Push")).toBe("/treinos/novo?nome=Push");
  });

  it("rejects null and undefined", () => {
    expect(sanitizeNextPath(null)).toBeNull();
    expect(sanitizeNextPath(undefined)).toBeNull();
  });

  it("rejects an empty string", () => {
    expect(sanitizeNextPath("")).toBeNull();
  });

  it("rejects a path that doesn't start with a slash", () => {
    expect(sanitizeNextPath("treinos")).toBeNull();
  });

  it("rejects a protocol-relative URL", () => {
    expect(sanitizeNextPath("//evil.com")).toBeNull();
  });

  it("rejects a backslash trick", () => {
    expect(sanitizeNextPath("/\\evil.com")).toBeNull();
  });

  it("rejects an absolute URL with a scheme", () => {
    expect(sanitizeNextPath("https://evil.com")).toBeNull();
  });

  it("rejects a path embedding a scheme", () => {
    expect(sanitizeNextPath("/redirect?to=https://evil.com")).toBeNull();
  });

  it("rejects javascript: pseudo-protocol attempts", () => {
    expect(sanitizeNextPath("javascript://evil.com")).toBeNull();
  });
});
