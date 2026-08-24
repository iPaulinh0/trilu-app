import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";

const STORAGE_KEY = "trilu.avatar-key.v1";

interface AvatarKeyRecord {
  userId: string;
  avatarStorageKey: string | null;
}

/**
 * The avatar photo pipeline (IndexedDB Blob storage, see
 * indexeddb-profile-image-storage.ts) predates this Supabase Auth
 * integration and isn't part of it — there's no Supabase Storage wiring
 * yet, so the pointer into that local Blob store stays here rather than
 * on the `profiles` row.
 */
export interface AvatarKeyStorage {
  get(userId: string): string | null;
  set(userId: string, avatarStorageKey: string | null): void;
}

export function createLocalAvatarKeyStorage(kv: KeyValueStorage): AvatarKeyStorage {
  const collection = createCollectionStorage<AvatarKeyRecord>(kv, STORAGE_KEY);

  return {
    get(userId) {
      return collection.getAll().find((r) => r.userId === userId)?.avatarStorageKey ?? null;
    },
    set(userId, avatarStorageKey) {
      const all = collection.getAll();
      const index = all.findIndex((r) => r.userId === userId);
      const record: AvatarKeyRecord = { userId, avatarStorageKey };
      if (index === -1) collection.setAll([...all, record]);
      else collection.setAll(all.map((r) => (r.userId === userId ? record : r)));
    },
  };
}
