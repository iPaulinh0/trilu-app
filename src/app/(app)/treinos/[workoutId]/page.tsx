"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { workoutRepository, recordExerciseUsage } from "@/lib/services";
import { useStartWorkoutSession } from "@/features/workouts/hooks/use-start-workout-session";
import { WorkoutDetailExerciseCard } from "@/features/workouts/components/workout-detail-exercise-card";
import { ExercisePickerSheet, type AddedExercise } from "@/features/exercises/components/exercise-picker-sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";
import {
  DEFAULT_REST_SECONDS_ON_ADD,
  DEFAULT_SETS_ON_ADD,
  DEFAULT_TARGET_REPS_ON_ADD,
} from "@/features/workouts/domain/types";
import type { WorkoutTemplateWithExercises } from "@/features/workouts/domain/workout-repository";
import type { WorkoutTemplateExercise } from "@/features/workouts/domain/types";

export default function WorkoutDetailPage() {
  const params = useParams<{ workoutId: string }>();
  const router = useRouter();
  const { start } = useStartWorkoutSession();
  const [data, setData] = useState<WorkoutTemplateWithExercises | null | undefined>(undefined);
  const [loadError, setLoadError] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let cancelled = false;
    workoutRepository
      .getById(params.workoutId)
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch(() => {
        if (!cancelled) setLoadError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [params.workoutId]);

  if (loadError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Mascot size={110} />
        <h1 className="text-xl font-bold text-ink-900">Não conseguimos carregar esse treino.</h1>
        <Button type="button" variant="accent" onClick={() => router.refresh()}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (data === undefined) {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

  // Ownership is enforced server-side by RLS: a workout id that exists but
  // belongs to another user comes back exactly like one that doesn't exist
  // at all — this "não encontrado" state is the only outcome either way, so
  // switching URLs never leaks whether the id belongs to someone else.
  if (data === null) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 py-10 text-center">
        <Mascot size={110} />
        <h1 className="text-xl font-bold text-ink-900">Não encontramos esse treino.</h1>
        <Button type="button" variant="outline" onClick={() => router.push("/treinos")}>
          Voltar para meus treinos
        </Button>
      </div>
    );
  }

  const { template, exercises } = data;
  const existingKeys = new Set(
    exercises.map((e) => `${e.exerciseSource}:${e.exerciseSource === "custom" ? e.customExerciseId : e.providerExerciseId}`),
  );

  function updateExercise(updated: WorkoutTemplateExercise) {
    setData((prev) => (prev ? { ...prev, exercises: prev.exercises.map((e) => (e.id === updated.id ? updated : e)) } : prev));
  }

  async function handleAddExercise({ exercise }: AddedExercise) {
    setIsAdding(true);
    try {
      const added = await workoutRepository.addExercise(template.id, {
        exerciseSource: exercise.provider,
        providerExerciseId: exercise.provider === "exercisedb" ? exercise.providerId : null,
        customExerciseId: exercise.provider === "custom" ? exercise.providerId : null,
        exerciseNameSnapshot: exercise.displayName,
        muscleGroup: exercise.primaryMuscleGroup,
        equipment: exercise.equipment[0] ?? null,
        gifUrl: exercise.gifUrl,
        defaultSets: DEFAULT_SETS_ON_ADD,
        targetRepMin: DEFAULT_TARGET_REPS_ON_ADD,
        targetRepMax: DEFAULT_TARGET_REPS_ON_ADD,
        defaultRestSeconds: DEFAULT_REST_SECONDS_ON_ADD,
        notes: null,
      });
      recordExerciseUsage(exercise);
      setData((prev) => (prev ? { ...prev, exercises: [...prev.exercises, added] } : prev));
      toast.success(`"${exercise.displayName}" adicionado ao treino.`);
      setPickerOpen(false);
    } catch {
      toast.error("Não foi possível adicionar esse exercício agora.");
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemoveExercise(exercise: WorkoutTemplateExercise) {
    try {
      await workoutRepository.removeExercise(exercise.id);
      setData((prev) => (prev ? { ...prev, exercises: prev.exercises.filter((e) => e.id !== exercise.id) } : prev));
      toast.success(`"${exercise.exerciseNameSnapshot}" removido do treino.`);
    } catch {
      toast.error("Não foi possível remover esse exercício agora.");
    }
  }

  async function handleMoveExercise(exercise: WorkoutTemplateExercise, direction: -1 | 1) {
    try {
      await workoutRepository.moveExercise(template.id, exercise.id, direction);
      const refreshed = await workoutRepository.getById(template.id);
      if (refreshed) setData(refreshed);
    } catch {
      toast.error("Não foi possível reordenar agora.");
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <div>
        <button type="button" onClick={() => router.push("/treinos")} className="text-sm font-bold text-ink-500 hover:text-ink-700">
          ← Voltar
        </button>
        <h1 className="mt-1 text-2xl font-bold text-ink-900">{template.name}</h1>
        <p className="text-sm text-ink-500">
          {exercises.length} {exercises.length === 1 ? "exercício" : "exercícios"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {exercises.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-50 px-5 py-8 text-center">
            <Mascot size={90} />
            <p className="text-sm font-semibold text-ink-700">Nenhum exercício neste treino ainda.</p>
            <Button type="button" variant="accent" onClick={() => setPickerOpen(true)} loading={isAdding}>
              <PlusIcon className="size-4" aria-hidden />
              Adicionar exercício
            </Button>
          </div>
        ) : (
          <>
            {exercises.map((exercise, index) => (
              <WorkoutDetailExerciseCard
                key={exercise.id}
                exercise={exercise}
                canMoveUp={index > 0}
                canMoveDown={index < exercises.length - 1}
                onExerciseUpdated={updateExercise}
                onRemove={() => handleRemoveExercise(exercise)}
                onMoveUp={() => handleMoveExercise(exercise, -1)}
                onMoveDown={() => handleMoveExercise(exercise, 1)}
              />
            ))}
            <Button type="button" variant="outline" onClick={() => setPickerOpen(true)} loading={isAdding}>
              <PlusIcon className="size-4" aria-hidden />
              Adicionar exercício
            </Button>
          </>
        )}
      </div>

      <div className="mt-auto pt-4">
        <Button type="button" variant="accent" size="lg" block onClick={() => start(template.id)}>
          Iniciar
        </Button>
      </div>

      <ExercisePickerSheet open={pickerOpen} onOpenChange={setPickerOpen} onAdd={handleAddExercise} existingKeys={existingKeys} />
    </div>
  );
}
