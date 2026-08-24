import { NextResponse, type NextRequest } from "next/server";
import {
  fetchExerciseDbById,
  ExerciseDbRateLimitError,
  ExerciseDbTimeoutError,
  ExerciseDbUnavailableError,
} from "@/features/exercises/data/exercisedb-client";
import { mapExerciseDbItemToCatalogItem } from "@/features/exercises/data/exercisedb-mapper";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ exerciseId: string }> }) {
  const { exerciseId } = await params;
  try {
    const raw = await fetchExerciseDbById(exerciseId);
    if (!raw) return NextResponse.json({ error: "notFound", message: "Exercício não encontrado." }, { status: 404 });
    return NextResponse.json(mapExerciseDbItemToCatalogItem(raw));
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
