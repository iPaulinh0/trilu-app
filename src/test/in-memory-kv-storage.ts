import type { KeyValueStorage } from "@/lib/storage/kv-storage";

/** In-memory KeyValueStorage for tests — a stand-in for the real localStorage. */
export function createInMemoryKeyValueStorage(): KeyValueStorage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}
