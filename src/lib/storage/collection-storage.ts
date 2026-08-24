import type { KeyValueStorage } from "./kv-storage";

/**
 * A JSON array persisted under one KeyValueStorage key — the generic
 * "table" primitive every local repository (habits, entries, goals,
 * contributions…) is built on top of. Never imported by components; only
 * by data-layer repository implementations.
 */
export interface CollectionStorage<T> {
  getAll(): T[];
  setAll(items: T[]): void;
}

export function createCollectionStorage<T>(kv: KeyValueStorage, key: string): CollectionStorage<T> {
  return {
    getAll() {
      const raw = kv.getItem(key);
      if (!raw) return [];
      try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? (parsed as T[]) : [];
      } catch {
        return [];
      }
    },
    setAll(items) {
      kv.setItem(key, JSON.stringify(items));
    },
  };
}
