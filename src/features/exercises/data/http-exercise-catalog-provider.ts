import type { CustomExerciseRepository } from "../domain/custom-exercise-repository";
import { customExerciseToCatalogItem } from "../domain/custom-exercise-mapper";
import type { ExerciseCatalogProvider } from "../domain/exercise-catalog-provider";
import { ExerciseCatalogError, type ExerciseCatalogErrorReason } from "../domain/errors";
import { MUSCLE_GROUP_LABELS, TRILU_MUSCLE_GROUPS, EXERCISE_SEARCH_MIN_LENGTH } from "../domain/types";
import type { ExerciseCatalogItem, ExerciseSearchFilters, ExerciseSearchPage, TriluMuscleGroup } from "../domain/types";
import type { UsedExerciseIndex, UsedExerciseRecord } from "./used-exercise-index";

export interface HttpExerciseCatalogProviderDeps {
  customExerciseRepository: CustomExerciseRepository;
  usedExerciseIndex: UsedExerciseIndex;
  getUserId: () => string;
}

function usedRecordToCatalogItem(record: UsedExerciseRecord): ExerciseCatalogItem {
  return {
    providerId: record.providerId,
    provider: record.provider,
    name: record.name,
    displayName: record.displayName,
    gifUrl: null,
    bodyParts: [],
    primaryMuscles: [],
    secondaryMuscles: [],
    equipment: [],
    instructions: [],
    isCustom: record.provider === "custom",
    primaryMuscleGroup: record.primaryMuscleGroup,
    secondaryMuscleGroups: [],
  };
}

async function requestApi(path: string, signal?: AbortSignal): Promise<unknown> {
  let response: Response;
  try {
    response = await fetch(path, { signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ExerciseCatalogError("unavailable", "Não foi possível buscar exercícios agora.");
  }
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string; message?: string } | null;
    const reason: ExerciseCatalogErrorReason =
      body?.error === "timeout" || body?.error === "rateLimited" ? body.error : "unavailable";
    throw new ExerciseCatalogError(reason, body?.message ?? "Não foi possível buscar exercícios agora.");
  }
  return response.json();
}

export function createHttpExerciseCatalogProvider({
  customExerciseRepository,
  usedExerciseIndex,
  getUserId,
}: HttpExerciseCatalogProviderDeps): ExerciseCatalogProvider {
  function mergeTiers(
    custom: ExerciseCatalogItem[],
    used: ExerciseCatalogItem[],
    fresh: ExerciseCatalogItem[],
  ): ExerciseCatalogItem[] {
    const seen = new Set(custom.map((i) => `${i.provider}:${i.providerId}`));
    const usedUnique = used.filter((i) => {
      const key = `${i.provider}:${i.providerId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    const freshUnique = fresh.filter((i) => {
      const key = `${i.provider}:${i.providerId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...custom, ...usedUnique, ...freshUnique];
  }

  return {
    async search(query, filters: ExerciseSearchFilters, cursor, signal?: AbortSignal) {
      const trimmed = query.trim();
      const hasQuery = trimmed.length >= EXERCISE_SEARCH_MIN_LENGTH;
      const userId = getUserId();

      const custom = hasQuery ? (await customExerciseRepository.search(trimmed)).map(customExerciseToCatalogItem) : [];
      const used = hasQuery ? usedExerciseIndex.search(userId, trimmed).map(usedRecordToCatalogItem) : [];

      if (!hasQuery && !filters.muscleGroup && !filters.equipment?.length) {
        return { items: mergeTiers(custom, used, []), nextCursor: null, hasMore: false };
      }

      const params = new URLSearchParams();
      if (hasQuery) params.set("name", trimmed);
      if (filters.muscleGroup) params.set("muscleGroup", filters.muscleGroup);
      if (filters.equipment?.length) params.set("equipment", filters.equipment.join(","));
      if (cursor) params.set("cursor", cursor);

      const page = (await requestApi(`/api/exercises?${params.toString()}`, signal)) as ExerciseSearchPage;
      return {
        items: mergeTiers(custom, used, page.items),
        nextCursor: page.nextCursor,
        hasMore: page.hasMore,
      };
    },

    async getById(id) {
      const custom = await customExerciseRepository.getById(id);
      if (custom) return customExerciseToCatalogItem(custom);
      try {
        return (await requestApi(`/api/exercises/${encodeURIComponent(id)}`)) as ExerciseCatalogItem;
      } catch (error) {
        if (error instanceof ExerciseCatalogError && error.reason === "notFound") return null;
        throw error;
      }
    },

    async getMuscleGroups() {
      return TRILU_MUSCLE_GROUPS.map((group: TriluMuscleGroup) => ({ group, label: MUSCLE_GROUP_LABELS[group] }));
    },

    async getByMuscleGroup(group, cursor) {
      const params = new URLSearchParams({ muscleGroup: group });
      if (cursor) params.set("cursor", cursor);
      const page = (await requestApi(`/api/exercises?${params.toString()}`)) as ExerciseSearchPage;
      return page;
    },
  };
}
