"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { workoutRepository } from "@/lib/services";
import { useStartWorkoutSession } from "@/features/workouts/hooks/use-start-workout-session";
import { MUSCLE_GROUP_LABELS } from "@/features/exercises/domain/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";
import type { WorkoutTemplateWithExercises } from "@/features/workouts/domain/workout-repository";

export default function WorkoutDetailPage() {
  const params = useParams<{ workoutId: string }>();
  const router = useRouter();
  const { start } = useStartWorkoutSession();
  const [data, setData] = useState<WorkoutTemplateWithExercises | null | undefined>(undefined);

  useEffect(() => {
    workoutRepository.getById(params.workoutId).then(setData);
  }, [params.workoutId]);

  if (data === undefined) {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
      </div>
    );
  }

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

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <div>
        <h1 className="text-2xl font-bold text-ink-900">{template.name}</h1>
        <p className="text-sm text-ink-500">{template.muscleGroups.map((g) => MUSCLE_GROUP_LABELS[g]).join(", ")}</p>
        {template.description ? <p className="mt-1 text-sm text-ink-700">{template.description}</p> : null}
      </div>

      <div className="flex flex-col gap-2">
        <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">
          {exercises.length} {exercises.length === 1 ? "EXERCÍCIO" : "EXERCÍCIOS"}
        </h2>
        {exercises.map((exercise) => (
          <div key={exercise.id} className="rounded-2xl border border-ink-100 bg-card p-3">
            <p className="font-body text-sm font-bold text-ink-900">{exercise.exerciseNameSnapshot}</p>
            <p className="text-xs text-ink-500">
              {exercise.defaultSets} séries · {exercise.targetRepMin}-{exercise.targetRepMax} reps ·{" "}
              {exercise.defaultRestSeconds}s descanso
            </p>
          </div>
        ))}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button type="button" variant="accent" size="lg" block onClick={() => start(template.id)}>
          Iniciar
        </Button>
        <Button type="button" variant="outline" size="lg" block onClick={() => router.push(`/treinos/${template.id}/editar`)}>
          Editar treino
        </Button>
      </div>
    </div>
  );
}
