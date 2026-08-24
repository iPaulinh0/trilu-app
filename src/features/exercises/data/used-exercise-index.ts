import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import type { ExerciseCatalogItem } from "../domain/types";

const USED_EXERCISES_KEY = "trilu.used-exercises.v1";

/**
 * A tiny local index of exercises the user has already added to a workout —
 * name + muscle group only, never a GIF/media URL, so search can surface
 * "already used" results without re-hitting ExerciseDB or storing media.
 */
export interface UsedExerciseRecord {
  userId: string;
  providerId: string;
  provider: "exercisedb" | "custom";
  name: string;
  displayName: string;
  primaryMuscleGroup: ExerciseCatalogItem["primaryMuscleGroup"];
  lastUsedAt: string;
}

export interface UsedExerciseIndex {
  record(userId: string, item: ExerciseCatalogItem): void;
  search(userId: string, query: string): UsedExerciseRecord[];
}

export function createUsedExerciseIndex(kv: KeyValueStorage): UsedExerciseIndex {
  const records = createCollectionStorage<UsedExerciseRecord>(kv, USED_EXERCISES_KEY);

  return {
    record(userId, item) {
      const all = records.getAll();
      const existingIndex = all.findIndex(
        (r) => r.userId === userId && r.providerId === item.providerId && r.provider === item.provider,
      );
      const entry: UsedExerciseRecord = {
        userId,
        providerId: item.providerId,
        provider: item.provider,
        name: item.name,
        displayName: item.displayName,
        primaryMuscleGroup: item.primaryMuscleGroup,
        lastUsedAt: new Date().toISOString(),
      };
      if (existingIndex === -1) {
        records.setAll([...all, entry]);
      } else {
        records.setAll(all.map((r, i) => (i === existingIndex ? entry : r)));
      }
    },

    search(userId, query) {
      const normalized = query.trim().toLowerCase();
      if (!normalized) return [];
      return records
        .getAll()
        .filter((r) => r.userId === userId && r.name.includes(normalized))
        .sort((a, b) => b.lastUsedAt.localeCompare(a.lastUsedAt));
    },
  };
}
