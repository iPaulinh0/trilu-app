"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2Icon } from "lucide-react";
import { toast } from "sonner";
import { useWorkouts, type WorkoutListItem } from "../hooks/use-workouts";
import { WorkoutCard } from "./workout-card";
import { WorkoutCalendarStrip } from "./workout-calendar-strip";
import { RenameWorkoutDialog } from "./rename-workout-dialog";
import { DeleteWorkoutDialog } from "./delete-workout-dialog";
import { DeleteCompletedSessionDialog } from "./delete-completed-session-dialog";
import { TodaysWorkoutSummaryCard } from "./todays-workout-summary-card";
import { StartAnotherWorkoutFab } from "./start-another-workout-fab";
import { SelectWorkoutDialog } from "./select-workout-dialog";
import { workoutRepository, workoutSessionRepository } from "@/lib/services";
import { todayDateKey } from "@/lib/date/local-date";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mascot } from "@/components/shared/mascot";
import type { TodaysWorkoutSummary } from "../domain/workout-session-repository";

export function WorkoutsListScreen() {
  const router = useRouter();
  const { items, status, reload } = useWorkouts();
  const [renameTarget, setRenameTarget] = useState<WorkoutListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WorkoutListItem | null>(null);
  const [todaysSummaries, setTodaysSummaries] = useState<TodaysWorkoutSummary[]>([]);
  const [deleteSessionTarget, setDeleteSessionTarget] = useState<TodaysWorkoutSummary | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    workoutSessionRepository.getTodaysWorkoutSummaries(todayDateKey()).then(setTodaysSummaries);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-col gap-3 py-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-11 w-full rounded-full" />
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-10 text-center">
        <Mascot size={120} />
        <h2 className="text-xl font-bold text-ink-900">Não conseguimos carregar seus treinos</h2>
        <Button type="button" variant="accent" onClick={reload}>
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-2">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Meus treinos</h1>
          <p className="text-sm text-ink-500">Cada treino concluído é mais um passo na sua trilha.</p>
        </div>
        <WorkoutCalendarStrip />
        <Button type="button" variant="accent" onClick={() => router.push("/treinos/novo")}>
          Criar treino
        </Button>
      </header>

      {todaysSummaries.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-mint-50 px-4 py-3">
            <CheckCircle2Icon className="size-5 shrink-0 text-mint-700" aria-hidden />
            <p className="text-sm font-semibold text-mint-700">
              {todaysSummaries.length === 1
                ? "Treino concluído hoje. Bom trabalho!"
                : `${todaysSummaries.length} treinos concluídos hoje. Bom trabalho!`}
            </p>
          </div>
          {todaysSummaries.map((summary) => (
            <TodaysWorkoutSummaryCard
              key={summary.sessionId}
              summary={summary}
              onDelete={() => setDeleteSessionTarget(summary)}
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-violet-50 px-5 py-8 text-center">
          <Mascot size={96} />
          <h2 className="font-display text-lg font-semibold text-ink-900">Nenhum treino ainda</h2>
          <p className="text-sm text-ink-700">Crie seu primeiro treino para começar a acompanhar seu progresso.</p>
          <Button type="button" variant="accent" onClick={() => router.push("/treinos/novo")}>
            Criar treino
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <WorkoutCard
              key={item.template.id}
              item={item}
              onOpen={() => router.push(`/treinos/${item.template.id}`)}
              onDuplicate={async () => {
                try {
                  await workoutRepository.duplicate(item.template.id);
                  toast.success("Treino duplicado.");
                  reload();
                } catch {
                  toast.error("Não foi possível duplicar agora.");
                }
              }}
              onRename={() => setRenameTarget(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          ))}
        </div>
      )}

      {renameTarget ? (
        <RenameWorkoutDialog
          open={renameTarget !== null}
          onOpenChange={(open) => !open && setRenameTarget(null)}
          currentName={renameTarget.template.name}
          onConfirm={async (name) => {
            try {
              await workoutRepository.rename(renameTarget.template.id, name);
              toast.success("Treino renomeado.");
              reload();
            } catch {
              toast.error("Não foi possível renomear agora.");
            }
          }}
        />
      ) : null}

      <DeleteWorkoutDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        workoutName={deleteTarget?.template.name ?? ""}
        onConfirm={async () => {
          if (!deleteTarget) return;
          const name = deleteTarget.template.name;
          try {
            await workoutRepository.archive(deleteTarget.template.id);
            toast.success(`"${name}" foi excluído.`);
            reload();
          } catch {
            toast.error("Não foi possível excluir agora.");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />

      <DeleteCompletedSessionDialog
        open={deleteSessionTarget !== null}
        onOpenChange={(open) => !open && setDeleteSessionTarget(null)}
        workoutName={deleteSessionTarget?.workoutName ?? ""}
        onConfirm={async () => {
          if (!deleteSessionTarget) return;
          const target = deleteSessionTarget;
          try {
            await workoutSessionRepository.deleteCompletedSession(target.sessionId);
            setTodaysSummaries((prev) => prev.filter((s) => s.sessionId !== target.sessionId));
            toast.success(`"${target.workoutName}" removido de hoje.`);
          } catch {
            toast.error("Não foi possível excluir agora.");
          } finally {
            setDeleteSessionTarget(null);
          }
        }}
      />

      {todaysSummaries.length > 0 ? <StartAnotherWorkoutFab onClick={() => setPickerOpen(true)} /> : null}
      <SelectWorkoutDialog open={pickerOpen} onOpenChange={setPickerOpen} items={items} />
    </div>
  );
}
