"use client";

import { useState } from "react";
import { ChevronDownIcon, MoreVerticalIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ExerciseGif } from "@/features/exercises/components/exercise-gif";
import { MUSCLE_GROUP_LABELS } from "@/features/exercises/domain/types";
import { getEquipmentLabel } from "@/features/exercises/domain/muscle-group-map";
import { workoutSessionRepository } from "@/lib/services";
import { buildExerciseProgressSeries, isEvolutionChartUnlocked, isExerciseBodyweightOnly } from "../domain/progress";
import { ExerciseEvolutionChart } from "./exercise-evolution-chart";
import { EvolutionChartLocked } from "./evolution-chart-locked";
import { WorkoutExerciseSetEditor } from "./workout-exercise-set-editor";
import { Skeleton } from "@/components/ui/skeleton";
import type { ExerciseHistoryEntry } from "../domain/workout-session-repository";
import type { ExerciseIdentity, WorkoutTemplateExercise } from "../domain/types";

interface WorkoutDetailExerciseCardProps {
  exercise: WorkoutTemplateExercise;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onExerciseUpdated: (exercise: WorkoutTemplateExercise) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/**
 * The graph reuses the *existing* local session-history query
 * (workoutSessionRepository), scoped by exercise identity — not a new
 * Supabase history table. Starting/completing workouts stays local for
 * this stage, so this is genuinely real history, never fabricated.
 */
export function WorkoutDetailExerciseCard({
  exercise,
  canMoveUp,
  canMoveDown,
  onExerciseUpdated,
  onRemove,
  onMoveUp,
  onMoveDown,
}: WorkoutDetailExerciseCardProps) {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<ExerciseHistoryEntry[] | null>(null);
  const [historyError, setHistoryError] = useState(false);

  function fetchHistory() {
    setHistoryError(false);
    const identity: ExerciseIdentity = {
      exerciseSource: exercise.exerciseSource,
      providerExerciseId: exercise.providerExerciseId,
      customExerciseId: exercise.customExerciseId,
    };
    workoutSessionRepository
      .listCompletedSessionsForExercise(identity)
      .then(setHistory)
      .catch(() => setHistoryError(true));
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (next && history === null && !historyError) fetchHistory();
  }

  const repsLabel =
    exercise.targetRepMin === exercise.targetRepMax
      ? `${exercise.targetRepMax} repetições`
      : `${exercise.targetRepMin}-${exercise.targetRepMax} repetições`;
  const summary = `${exercise.defaultSets} ${exercise.defaultSets === 1 ? "série" : "séries"} · ${repsLabel} · ${exercise.defaultRestSeconds}s de descanso`;

  return (
    <Collapsible open={open} onOpenChange={handleOpenChange} className="rounded-2xl border border-ink-100 bg-card">
      <div className="flex items-center gap-2 pr-3">
        <CollapsibleTrigger className="flex min-h-11 min-w-0 flex-1 items-center gap-3 rounded-2xl p-3 text-left outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40">
          <ExerciseGif gifUrl={exercise.gifUrl} alt={exercise.exerciseNameSnapshot} className="size-16 shrink-0 rounded-xl" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-base font-bold text-ink-900">{exercise.exerciseNameSnapshot}</p>
            {exercise.muscleGroup ? (
              <p className="truncate text-xs text-ink-500">{MUSCLE_GROUP_LABELS[exercise.muscleGroup]}</p>
            ) : null}
            <p className="mt-0.5 truncate text-xs text-ink-500">{summary}</p>
          </div>
          <ChevronDownIcon
            className={`size-5 shrink-0 text-ink-400 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
          <span className="sr-only">{open ? "Recolher exercício" : "Expandir exercício"}</span>
        </CollapsibleTrigger>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Mais ações para ${exercise.exerciseNameSnapshot}`}
              className="flex size-11 shrink-0 items-center justify-center rounded-full text-ink-500 outline-none hover:bg-ink-50 focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
            >
              <MoreVerticalIcon className="size-5" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled={!canMoveUp} onSelect={onMoveUp}>
              Mover para cima
            </DropdownMenuItem>
            <DropdownMenuItem disabled={!canMoveDown} onSelect={onMoveDown}>
              Mover para baixo
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onRemove}>
              Remover exercício
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CollapsibleContent>
        <div className="flex flex-col gap-5 border-t border-ink-100 p-3">
          {exercise.equipment ? (
            <p className="text-xs font-semibold text-ink-500">Equipamento: {getEquipmentLabel(exercise.equipment)}</p>
          ) : null}

          <WorkoutExerciseSetEditor exercise={exercise} onSaved={onExerciseUpdated} />

          <div className="flex flex-col gap-2">
            <h3 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">EVOLUÇÃO</h3>
            {historyError ? (
              <div className="flex flex-col items-center gap-2 rounded-2xl bg-ink-50 px-4 py-6 text-center">
                <p className="text-sm text-ink-500">Não foi possível carregar o histórico agora.</p>
                <button type="button" onClick={fetchHistory} className="text-sm font-bold text-violet-600 hover:underline">
                  Tentar novamente
                </button>
              </div>
            ) : history === null ? (
              <Skeleton className="h-40 w-full rounded-2xl" />
            ) : history.length === 0 ? (
              <p className="rounded-2xl bg-ink-50 px-4 py-6 text-center text-sm text-ink-500">
                Complete este exercício em seus treinos para acompanhar sua evolução.
              </p>
            ) : (
              <ExerciseHistoryChart history={history} />
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

function ExerciseHistoryChart({ history }: { history: ExerciseHistoryEntry[] }) {
  const points = buildExerciseProgressSeries(history);
  if (!isEvolutionChartUnlocked(points.length)) {
    return <EvolutionChartLocked distinctSessionCount={points.length} />;
  }
  return <ExerciseEvolutionChart points={points} isBodyweightOnly={isExerciseBodyweightOnly(points)} />;
}
