"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import { useWorkoutSession } from "../hooks/use-workout-session";
import { startRestTimer } from "../domain/rest-timer";
import { SessionExerciseCard } from "./session-exercise-card";
import { RestTimerDrawer } from "./rest-timer-drawer";
import { ExitSessionDialog } from "./exit-session-dialog";
import { SessionSummary } from "./session-summary";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Mascot } from "@/components/shared/mascot";
import type { CompleteSessionResult } from "../domain/workout-session-repository";

interface WorkoutSessionScreenProps {
  sessionId: string;
}

export function WorkoutSessionScreen({ sessionId }: WorkoutSessionScreenProps) {
  const router = useRouter();
  const {
    session,
    status,
    toggleSet,
    addSet,
    updateSet,
    duplicateSet,
    deleteSet,
    moveSet,
    updateRestTimer,
    cancelSession,
    saveAsDraft,
    completeSession,
  } = useWorkoutSession(sessionId);

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [restDrawerOpen, setRestDrawerOpen] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [summary, setSummary] = useState<CompleteSessionResult | null>(null);

  useEffect(() => {
    if (session && (session.status === "completed" || session.status === "cancelled") && !summary) {
      router.replace("/treinos");
    }
  }, [session, summary, router]);

  if (status === "loading") return null;

  if (status === "notFound" || !session) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 px-5 text-center">
        <Mascot size={110} />
        <h1 className="text-xl font-bold text-ink-900">Essa sessão não existe mais.</h1>
        <Button type="button" variant="accent" onClick={() => router.push("/treinos")}>
          Voltar para meus treinos
        </Button>
      </div>
    );
  }

  if (summary) {
    return (
      <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <SessionSummary
          result={summary}
          onFinish={() => router.push("/trilha")}
          onShare={() => router.push(`/treinos/sessao/${sessionId}/compartilhar`)}
        />
      </div>
    );
  }

  if (session.status === "completed" || session.status === "cancelled") {
    return null;
  }

  const exercises = session.exerciseSessions;
  const current = exercises[Math.min(exerciseIndex, exercises.length - 1)];

  async function handleToggleSet(setLogId: string) {
    const wasCompleted = current.setLogs.find((s) => s.id === setLogId)?.completedAt !== null;
    await toggleSet(setLogId);
    if (!wasCompleted) {
      const justCompleted = current.setLogs.find((s) => s.id === setLogId);
      const restSeconds = justCompleted?.restSeconds ?? 60;
      await updateRestTimer(startRestTimer(restSeconds));
      setRestDrawerOpen(true);
      toast.success("Você avançou mais 1 passo!");
    }
  }

  async function handleComplete() {
    const result = await completeSession();
    if (result) setSummary(result);
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-[430px] flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))]">
      <header className="flex items-center justify-between gap-2 py-2">
        <button
          type="button"
          onClick={() => setExitDialogOpen(true)}
          aria-label="Sair do treino"
          className="flex size-11 items-center justify-center rounded-full text-ink-700 hover:bg-ink-50"
        >
          <XIcon className="size-5" aria-hidden />
        </button>
        <div className="flex flex-col items-center">
          <Logo height={20} />
          <span className="mt-0.5 max-w-[220px] truncate text-sm font-bold text-ink-900">
            {session.workoutNameSnapshot}
          </span>
        </div>
        <div className="size-11" aria-hidden />
      </header>

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pb-6">
        <SessionExerciseCard
          exerciseSession={current}
          position={exerciseIndex + 1}
          total={exercises.length}
          onToggleSet={handleToggleSet}
          onUpdateSet={updateSet}
          onToggleWarmup={(setLogId) => {
            const set = current.setLogs.find((s) => s.id === setLogId);
            if (set) updateSet(setLogId, { isWarmup: !set.isWarmup });
          }}
          onDuplicateSet={duplicateSet}
          onDeleteSet={deleteSet}
          onMoveSet={(setLogId, direction) => moveSet(current.id, setLogId, direction)}
          onAddSet={() => {
            const last = current.setLogs[current.setLogs.length - 1];
            addSet(current.id, {
              weightKg: last?.weightKg ?? 0,
              repetitions: last?.repetitions ?? 0,
              restSeconds: last?.restSeconds ?? 60,
              isWarmup: false,
            });
          }}
          onOpenRestTimer={() => setRestDrawerOpen(true)}
        />
      </div>

      <RestTimerDrawer
        open={restDrawerOpen}
        onOpenChange={setRestDrawerOpen}
        timer={session.restTimer}
        onChangeTimer={updateRestTimer}
      />

      <div className="flex flex-col gap-2 border-t border-ink-100 pt-3">
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            block
            disabled={exerciseIndex === 0}
            onClick={() => setExerciseIndex((i) => Math.max(0, i - 1))}
          >
            <ChevronLeftIcon className="size-4" aria-hidden />
            Anterior
          </Button>
          <Button
            type="button"
            variant="secondary"
            block
            disabled={exerciseIndex >= exercises.length - 1}
            onClick={() => setExerciseIndex((i) => Math.min(exercises.length - 1, i + 1))}
          >
            Próximo exercício
            <ChevronRightIcon className="size-4" aria-hidden />
          </Button>
        </div>
        <Button type="button" variant="accent" size="lg" block onClick={handleComplete}>
          Concluir treino
        </Button>
      </div>

      <ExitSessionDialog
        open={exitDialogOpen}
        onOpenChange={setExitDialogOpen}
        onSaveAsDraft={async () => {
          await saveAsDraft();
          router.push("/trilha");
        }}
        onDiscard={async () => {
          await cancelSession();
          router.push("/trilha");
        }}
      />
    </div>
  );
}
