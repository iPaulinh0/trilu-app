import { MoreVerticalIcon } from "lucide-react";
import { formatWorkoutDuration } from "../domain/format";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TodaysWorkoutSummary } from "../domain/workout-session-repository";

interface TodaysWorkoutSummaryCardProps {
  summary: TodaysWorkoutSummary;
  onDelete: () => void;
}

/** One completed-today workout's real stats — never fabricated. Several of these can stack when more than one workout was done the same day. */
export function TodaysWorkoutSummaryCard({ summary, onDelete }: TodaysWorkoutSummaryCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-2">
        <p className="min-w-0 truncate font-display text-lg font-semibold text-ink-900">{summary.workoutName}</p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Mais ações para ${summary.workoutName}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 outline-none hover:bg-ink-50 focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
            >
              <MoreVerticalIcon className="size-5" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              Excluir treino
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {summary.exerciseNames.length > 0 ? (
        <p className="text-xs text-ink-500">{summary.exerciseNames.join(", ")}</p>
      ) : null}

      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-ink-50 px-2 py-2 text-center">
          <p className="font-display text-base font-extrabold text-ink-900">{formatWorkoutDuration(summary.durationSeconds)}</p>
          <p className="text-[11px] font-semibold text-ink-500">Duração</p>
        </div>
        <div className="rounded-xl bg-ink-50 px-2 py-2 text-center">
          <p className="font-display text-base font-extrabold text-ink-900">{summary.totalReps}</p>
          <p className="text-[11px] font-semibold text-ink-500">Repetições</p>
        </div>
        <div className="rounded-xl bg-ink-50 px-2 py-2 text-center">
          <p className="font-display text-base font-extrabold text-ink-900">{Math.round(summary.totalVolumeKg)} kg</p>
          <p className="text-[11px] font-semibold text-ink-500">Volume</p>
        </div>
      </div>
    </div>
  );
}
