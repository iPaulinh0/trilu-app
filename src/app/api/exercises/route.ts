import { NextResponse, type NextRequest } from "next/server";
import {
  fetchExerciseDbList,
  ExerciseDbRateLimitError,
  ExerciseDbTimeoutError,
  ExerciseDbUnavailableError,
} from "@/features/exercises/data/exercisedb-client";
import { mapExerciseDbItemToCatalogItem } from "@/features/exercises/data/exercisedb-mapper";
import { getProviderMusclesForGroup } from "@/features/exercises/domain/muscle-group-map";
import { resolveSearchTerm } from "@/features/exercises/domain/search-aliases";
import { EXERCISE_SEARCH_PAGE_SIZE, TRILU_MUSCLE_GROUPS, type TriluMuscleGroup } from "@/features/exercises/domain/types";
import type { ExerciseSearchPage } from "@/features/exercises/domain/types";

export const dynamic = "force-dynamic";

function isMuscleGroup(value: string | null): value is TriluMuscleGroup {
  return !!value && (TRILU_MUSCLE_GROUPS as readonly string[]).includes(value);
}

/**
 * Proxies the free ExerciseDB tier so no component ever calls it (or sees
 * its field names) directly. Normalizes the response to
 * ExerciseCatalogItem before it leaves the server.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const rawName = searchParams.get("name")?.trim();
  const muscleGroupParam = searchParams.get("muscleGroup");
  const equipmentParam = searchParams.get("equipment");
  const cursor = searchParams.get("cursor") ?? undefined;
  const limitParam = Number(searchParams.get("limit"));
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 25) : EXERCISE_SEARCH_PAGE_SIZE;

  const muscleGroup = isMuscleGroup(muscleGroupParam) ? muscleGroupParam : null;

  try {
    const raw = await fetchExerciseDbList({
      name: rawName ? resolveSearchTerm(rawName) : undefined,
      targetMuscles: muscleGroup ? getProviderMusclesForGroup(muscleGroup) : undefined,
      equipments: equipmentParam ? equipmentParam.split(",").filter(Boolean) : undefined,
      limit,
      after: cursor,
    });

    const page: ExerciseSearchPage = {
      items: raw.data.map(mapExerciseDbItemToCatalogItem),
      nextCursor: raw.meta.hasNextPage ? (raw.meta.nextCursor ?? null) : null,
      hasMore: raw.meta.hasNextPage,
    };
    return NextResponse.json(page);
  } catch (error) {
    if (error instanceof ExerciseDbTimeoutError) {
      return NextResponse.json({ error: "timeout", message: error.message }, { status: 504 });
    }
    if (error instanceof ExerciseDbRateLimitError) {
      return NextResponse.json({ error: "rateLimited", message: error.message }, { status: 429 });
    }
    if (error instanceof ExerciseDbUnavailableError) {
      return NextResponse.json({ error: "unavailable", message: error.message }, { status: 503 });
    }
    return NextResponse.json({ error: "unavailable", message: "Erro inesperado." }, { status: 503 });
  }
}
