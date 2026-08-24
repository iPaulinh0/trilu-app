"use client";

import { useSyncExternalStore } from "react";
import { authSessionStorage } from "@/lib/services";
import type { AuthUser } from "../domain/types";

/**
 * Distinguishes "haven't read localStorage yet" (SSR / first paint) from
 * "read it, nobody's logged in" — both would otherwise collapse to `null`
 * and make redirect guards fire one render too early.
 */
const UNLOADED = Symbol("unloaded");
type UserSnapshot = AuthUser | null | typeof UNLOADED;

let cached: UserSnapshot = UNLOADED;

function getSnapshot(): UserSnapshot {
  if (cached === UNLOADED) cached = authSessionStorage.load();
  return cached;
}

function getServerSnapshot(): UserSnapshot {
  return UNLOADED;
}

function subscribe(): () => void {
  return () => {};
}

/**
 * Reads the current auth session without a setState-in-effect hydration
 * dance. `isHydrated` is false for exactly one render (SSR + first client
 * paint); guard effects should wait for it before redirecting.
 */
export function useCurrentUser(): { user: AuthUser | null; isHydrated: boolean } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isHydrated = snapshot !== UNLOADED;
  return { user: isHydrated ? (snapshot as AuthUser | null) : null, isHydrated };
}

/** Call after login/signup/logout so already-mounted components see the change. */
export function invalidateCurrentUserCache(): void {
  cached = UNLOADED;
}
