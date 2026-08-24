"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { workoutRepository, workoutSessionRepository } from "@/lib/services";
import { WorkoutSessionConflictError } from "../domain/errors";

/** Centralizes "tap Iniciar" so the list, detail, and Home mission card all behave the same way. */
export function useStartWorkoutSession() {
  const router = useRouter();

  async function start(workoutTemplateId: string) {
    const active = await workoutSessionRepository.getActiveSession();
    if (active) {
      toast.info("Você já tem um treino em andamento.", {
        action: { label: "Continuar", onClick: () => router.push(`/treinos/sessao/${active.id}`) },
      });
      return;
    }

    const full = await workoutRepository.getById(workoutTemplateId);
    if (!full) {
      toast.error("Não encontramos esse treino.");
      return;
    }

    try {
      const session = await workoutSessionRepository.startSession(
        full.template.id,
        full.template.name,
        full.exercises.map((exercise) => ({
          exerciseSource: exercise.exerciseSource,
          providerExerciseId: exercise.providerExerciseId,
          customExerciseId: exercise.customExerciseId,
          exerciseNameSnapshot: exercise.exerciseNameSnapshot,
          suggestedSets: exercise.defaultSets,
          suggestedRestSeconds: exercise.defaultRestSeconds,
          notes: exercise.notes,
        })),
      );
      router.push(`/treinos/sessao/${session.id}`);
    } catch (error) {
      if (error instanceof WorkoutSessionConflictError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível iniciar o treino agora.");
      }
    }
  }

  return { start };
}
