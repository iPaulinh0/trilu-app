import { describe, expect, it, vi } from "vitest";
import { signOut } from "./sign-out";

describe("signOut", () => {
  it("clears the session and invalidates the cache once the auth service confirms sign-out", async () => {
    const clearSession = vi.fn();
    const invalidateCache = vi.fn();
    const authService = { signOut: vi.fn().mockResolvedValue(undefined) };

    await signOut({ authService, clearSession, invalidateCache });

    expect(authService.signOut).toHaveBeenCalledOnce();
    expect(clearSession).toHaveBeenCalledOnce();
    expect(invalidateCache).toHaveBeenCalledOnce();
  });

  it("leaves the session untouched when the auth service rejects", async () => {
    const clearSession = vi.fn();
    const invalidateCache = vi.fn();
    const authService = { signOut: vi.fn().mockRejectedValue(new Error("network down")) };

    await expect(signOut({ authService, clearSession, invalidateCache })).rejects.toThrow("network down");

    expect(clearSession).not.toHaveBeenCalled();
    expect(invalidateCache).not.toHaveBeenCalled();
  });
});
