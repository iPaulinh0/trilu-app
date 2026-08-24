"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { LineChartIcon, PlusIcon, TimerIcon } from "lucide-react";
import { useResolvedExercise } from "@/features/exercises/hooks/use-resolved-exercise";
import { ExerciseGif } from "@/features/exercises/components/exercise-gif";
import { encodeExerciseRouteId } from "@/features/exercises/domain/route-id";
import { workoutSessionRepository } from "@/lib/services";
import { SetRow } from "./set-row";
import { Button } from "@/components/ui/button";
import type { ExerciseSession } from "../domain/types";

interface SessionExerciseCardProps {
  exerciseSession: ExerciseSession;
  position: number;
  total: number;
  onToggleSet: (setLogId: string) => void;
  onUpdateSet: (setLogId: string, input: { weightKg?: number; repetitions?: number }) => void;
  onToggleWarmup: (setLogId: string) => void;
  onDuplicateSet: (setLogId: string) => void;
  onDeleteSet: (setLogId: string) => void;
  onMoveSet: (setLogId: string, direction: -1 | 1) => void;
  onAddSet: () => void;
  onOpenRestTimer: () => void;
}

export function SessionExerciseCard({
  exerciseSession,
  position,
  total,
  onToggleSet,
  onUpdateSet,
  onToggleWarmup,
  onDuplicateSet,
  onDeleteSet,
  onMoveSet,
  onAddSet,
  onOpenRestTimer,
}: SessionExerciseCardProps) {
  const providerId =
    exerciseSession.exerciseSource === "custom" ? exerciseSession.customExerciseId : exerciseSession.providerExerciseId;
  const resolved = useResolvedExercise(providerId);
  const [lastPerformance, setLastPerformance] = useState<{ weightKg: number; repetitions: number; dateKey: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    workoutSessionRepository
      .getLastPerformance({
        exerciseSource: exerciseSession.exerciseSource,
        providerExerciseId: exerciseSession.providerExerciseId,
        customExerciseId: exerciseSession.customExerciseId,
      })
      .then((result) => {
        if (!cancelled) setLastPerformance(result);
      });
    return () => {
      cancelled = true;
    };
  }, [exerciseSession.exerciseSource, exerciseSession.providerExerciseId, exerciseSession.customExerciseId]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold tracking-[0.08em] text-ink-500">
          EXERCÍCIO {position} DE {total}
        </span>
        <button
          type="button"
          onClick={onOpenRestTimer}
          className="flex min-h-9 items-center gap-1 rounded-full bg-violet-50 px-3 text-xs font-bold text-violet-600 hover:bg-violet-100"
        >
          <TimerIcon className="size-3.5" aria-hidden />
          Descanso
        </button>
      </div>

      <div className="flex items-center gap-3">
        <ExerciseGif
          gifUrl={resolved?.gifUrl ?? null}
          alt={exerciseSession.exerciseNameSnapshot}
          className="size-20 shrink-0 rounded-2xl"
        />
        <div className="min-w-0">
          <h2 className="truncate font-display text-xl font-semibold text-ink-900">
            {exerciseSession.exerciseNameSnapshot}
          </h2>
          {lastPerformance ? (
            <p className="text-sm text-ink-500">
              Último treino: {lastPerformance.weightKg} kg · {lastPerformance.repetitions} repetições
            </p>
          ) : (
            <p className="text-sm text-ink-400">Primeira vez com este exercício.</p>
          )}
          {providerId ? (
            <Link
              href={`/exercicios/${encodeExerciseRouteId(exerciseSession.exerciseSource, providerId)}/progresso`}
              className="mt-0.5 inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:underline"
            >
              <LineChartIcon className="size-3.5" aria-hidden />
              Ver evolução
            </Link>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {exerciseSession.setLogs.map((set, index) => (
          <SetRow
            key={set.id}
            set={set}
            canMoveUp={index > 0}
            canMoveDown={index < exerciseSession.setLogs.length - 1}
            onToggleComplete={() => onToggleSet(set.id)}
            onUpdate={(input) => onUpdateSet(set.id, input)}
            onToggleWarmup={() => onToggleWarmup(set.id)}
            onDuplicate={() => onDuplicateSet(set.id)}
            onDelete={() => onDeleteSet(set.id)}
            onMoveUp={() => onMoveSet(set.id, -1)}
            onMoveDown={() => onMoveSet(set.id, 1)}
          />
        ))}
      </div>

      <Button type="button" variant="outline" onClick={onAddSet}>
        <PlusIcon className="size-4" aria-hidden />
        Adicionar série
      </Button>
    </div>
  );
}
