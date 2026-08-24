import { createId } from "@/lib/id";
import type { ProfileImageStorage } from "../domain/profile-image-storage";

const DB_NAME = "trilu-profile-images";
const DB_VERSION = 1;
const STORE_NAME = "images";

/**
 * No backend/file storage exists yet for this app, so processed avatar
 * Blobs are kept in IndexedDB (never localStorage — Blobs are far too large
 * for that) behind the ProfileImageStorage interface. When a real backend
 * arrives, only this file changes: implement the same interface against
 * signed upload URLs and swap it in src/lib/services.ts.
 */
function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE_NAME)) {
        request.result.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function withStore<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await openDatabase();
  try {
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, mode);
      const request = run(tx.objectStore(STORE_NAME));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export function createIndexedDbProfileImageStorage(): ProfileImageStorage {
  return {
    async upload({ blob }) {
      if (!hasIndexedDb()) throw new Error("Armazenamento local de imagens indisponível neste navegador.");
      const key = createId("avatar");
      await withStore("readwrite", (store) => store.put(blob, key));
      return { key };
    },

    async getUrl(key) {
      if (!hasIndexedDb()) return null;
      const blob = await withStore<Blob | undefined>("readonly", (store) => store.get(key));
      return blob ? URL.createObjectURL(blob) : null;
    },

    async remove(key) {
      if (!hasIndexedDb()) return;
      await withStore("readwrite", (store) => store.delete(key));
    },
  };
}
