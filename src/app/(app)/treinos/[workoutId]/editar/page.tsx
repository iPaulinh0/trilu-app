"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { workoutRepository } from "@/lib/services";
import { WorkoutTemplateForm, type WorkoutExerciseDraft } from "@/features/workouts/components/workout-template-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";
import type { WorkoutTemplateWithExercises, WorkoutTemplateExerciseInput, WorkoutTemplateInput } from "@/features/workouts/domain/workout-repository";

export default function EditarTreinoPage() {
  const params = useParams<{ workoutId: string }>();
  const router = useRouter();
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
  const initialExercises: WorkoutExerciseDraft[] = exercises.map((e) => ({
    key: e.id,
    exerciseSource: e.exerciseSource,
    providerExerciseId: e.providerExerciseId,
    customExerciseId: e.customExerciseId,
    exerciseNameSnapshot: e.exerciseNameSnapshot,
    gifUrl: null,
    defaultSets: e.defaultSets,
    targetRepMin: e.targetRepMin,
    targetRepMax: e.targetRepMax,
    defaultRestSeconds: e.defaultRestSeconds,
    notes: e.notes,
  }));

  async function handleSubmit(input: WorkoutTemplateInput, exerciseInputs: WorkoutTemplateExerciseInput[]) {
    await workoutRepository.update(template.id, input, exerciseInputs);
    toast.success("Treino atualizado.");
    router.push(`/treinos/${template.id}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <h1 className="text-2xl font-bold text-ink-900">Editar treino</h1>
      <WorkoutTemplateForm
        initialValues={{
          name: template.name,
          description: template.description ?? undefined,
          muscleGroups: template.muscleGroups,
        }}
        initialExercises={initialExercises}
        onSubmit={handleSubmit}
        submitLabel="Salvar alterações"
      />
    </div>
  );
}
