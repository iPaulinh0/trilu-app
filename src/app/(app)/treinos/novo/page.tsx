"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { WorkoutTemplateForm } from "@/features/workouts/components/workout-template-form";
import { workoutRepository } from "@/lib/services";
import type { WorkoutTemplateExerciseInput, WorkoutTemplateInput } from "@/features/workouts/domain/workout-repository";

export default function NovoTreinoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillName = searchParams.get("nome") ?? "";

  async function handleSubmit(input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]) {
    const { template } = await workoutRepository.create(input, exercises);
    toast.success("Treino criado!");
    router.push(`/treinos/${template.id}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-4 py-2">
      <h1 className="text-2xl font-bold text-ink-900">Criar treino</h1>
      <WorkoutTemplateForm
        initialValues={{ name: prefillName }}
        onSubmit={handleSubmit}
        submitLabel="Salvar treino"
      />
    </div>
  );
}
