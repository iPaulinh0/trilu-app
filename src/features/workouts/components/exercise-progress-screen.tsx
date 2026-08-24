"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeExerciseRouteId } from "@/features/exercises/domain/route-id";
import { exerciseCatalogProvider, workoutSessionRepository } from "@/lib/services";
import { buildExerciseProgressSeries, isEvolutionChartUnlocked, isExerciseBodyweightOnly } from "../domain/progress";
import { computeSessionMaxLoad, computeSessionTotalReps, computeSessionVolume } from "../domain/volume";
import { formatRelativeDateKey, todayDateKey } from "@/lib/date/local-date";
import { ExerciseEvolutionChart } from "./exercise-evolution-chart";
import { EvolutionChartLocked } from "./evolution-chart-locked";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";
import type { ExerciseHistoryEntry } from "../domain/workout-session-repository";
import type { ExerciseIdentity } from "../domain/types";

interface ExerciseProgressScreenProps {
  routeId: string;
}

export function ExerciseProgressScreen({ routeId }: ExerciseProgressScreenProps) {
  const router = useRouter();
  const decoded = decodeExerciseRouteId(routeId);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [entries, setEntries] = useState<ExerciseHistoryEntry[] | null>(null);

  useEffect(() => {
    if (!decoded) return;
    const identity: ExerciseIdentity = {
      exerciseSource: decoded.provider,
      providerExerciseId: decoded.provider === "exercisedb" ? decoded.providerId : null,
      customExerciseId: decoded.provider === "custom" ? decoded.providerId : null,
    };
    exerciseCatalogProvider
      .getById(decoded.providerId)
      .then((item) => setDisplayName(item?.displayName ?? null))
      .catch(() => {
        // Best-effort title only — the header falls back to a generic label,
        // so a failed lookup (timeout, rate limit, provider down) shouldn't
        // surface as an unhandled rejection.
      });
    workoutSessionRepository.listCompletedSessionsForExercise(identity).then(setEntries);
  }, [decoded, routeId]);

  if (!decoded) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
        <Mascot size={100} />
        <p className="text-ink-700">Não conseguimos identificar esse exercício.</p>
      </div>
    );
  }

  if (entries === null) {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  const points = buildExerciseProgressSeries(entries);
  const distinctSessionCount = points.length;
  const bodyweightOnly = isExerciseBodyweightOnly(points);
  const today = todayDateKey();

  return (
    <div className="flex flex-1 flex-col gap-5 py-2">
      <div>
        <button type="button" onClick={() => router.back()} className="text-sm font-bold text-ink-500 hover:text-ink-700">
          ← Voltar
        </button>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">{displayName ?? "Evolução do exercício"}</h1>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-ink-50 px-5 py-8 text-center">
          <Mascot size={90} />
          <p className="text-sm font-semibold text-ink-700">
            Nenhum treino concluído com este exercício ainda.
          </p>
        </div>
      ) : isEvolutionChartUnlocked(distinctSessionCount) ? (
        <ExerciseEvolutionChart points={points} isBodyweightOnly={bodyweightOnly} />
      ) : (
        <EvolutionChartLocked distinctSessionCount={distinctSessionCount} />
      )}

      {entries.length > 0 ? (
        <div className="flex flex-col gap-2">
          <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">HISTÓRICO</h2>
          {[...entries]
            .sort((a, b) => b.dateKey.localeCompare(a.dateKey))
            .map((entry) => (
              <div key={entry.sessionId} className="rounded-2xl border border-ink-100 bg-card p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-ink-900">{formatRelativeDateKey(entry.dateKey, today)}</p>
                  <p className="text-xs text-ink-500">{entry.workoutNameSnapshot}</p>
                </div>
                <p className="mt-1 text-xs text-ink-600">
                  {entry.setLogs.map((s) => `${s.weightKg}kg×${s.repetitions}`).join(" · ")}
                </p>
                <p className="mt-1 text-xs font-semibold text-violet-600">
                  Carga máx {computeSessionMaxLoad(entry.setLogs)} kg · {computeSessionTotalReps(entry.setLogs)} reps ·{" "}
                  {Math.round(computeSessionVolume(entry.setLogs))} kg de volume
                </p>
              </div>
            ))}
        </div>
      ) : null}

      <Button type="button" variant="outline" onClick={() => router.push("/treinos")} className="mt-2">
        Voltar para meus treinos
      </Button>
    </div>
  );
}
