import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createDefaultUserProgress, type UserProgress } from "../domain/user-progress";

const STORAGE_KEY = "trilu.user-progress.v1";

export interface UserProgressStorage {
  get(userId: string): UserProgress | null;
  /** Returns the existing record, or creates+persists a default one. */
  ensure(userId: string): UserProgress;
  setHabitSetupCompleted(userId: string, completed: boolean): UserProgress;
}

export function createUserProgressStorage(kv: KeyValueStorage): UserProgressStorage {
  const collection = createCollectionStorage<UserProgress>(kv, STORAGE_KEY);

  function upsert(next: UserProgress): UserProgress {
    const all = collection.getAll();
    const index = all.findIndex((p) => p.userId === next.userId);
    if (index === -1) {
      collection.setAll([...all, next]);
    } else {
      collection.setAll(all.map((p) => (p.userId === next.userId ? next : p)));
    }
    return next;
  }

  return {
    get(userId) {
      return collection.getAll().find((p) => p.userId === userId) ?? null;
    },
    ensure(userId) {
      const existing = collection.getAll().find((p) => p.userId === userId);
      if (existing) return existing;
      return upsert(createDefaultUserProgress(userId));
    },
    setHabitSetupCompleted(userId, completed) {
      const current = collection.getAll().find((p) => p.userId === userId) ?? createDefaultUserProgress(userId);
      return upsert({ ...current, habitSetupCompleted: completed });
    },
  };
}
