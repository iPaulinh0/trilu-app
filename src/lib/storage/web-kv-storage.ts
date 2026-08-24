import type { KeyValueStorage } from "./kv-storage";

/**
 * Web implementation of KeyValueStorage backed by window.localStorage.
 * Safe to import from client components; every method no-ops on the server
 * (SSR) where `window` does not exist yet.
 */
export function createWebKeyValueStorage(): KeyValueStorage {
  const hasWindow = typeof window !== "undefined";

  return {
    getItem(key) {
      if (!hasWindow) return null;
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key, value) {
      if (!hasWindow) return;
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // Storage unavailable (private mode, quota, etc). Fail silently —
        // the app still works, it just won't resume across reloads.
      }
    },
    removeItem(key) {
      if (!hasWindow) return;
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore
      }
    },
  };
}
