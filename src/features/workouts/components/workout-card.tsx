"use client";

import { ChevronRightIcon, MoreVerticalIcon } from "lucide-react";
import { formatRelativeDateKey, todayDateKey } from "@/lib/date/local-date";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WorkoutListItem } from "../hooks/use-workouts";

interface WorkoutCardProps {
  item: WorkoutListItem;
  onOpen: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function WorkoutCard({ item, onOpen, onDuplicate, onRename, onDelete }: WorkoutCardProps) {
  const { template, exerciseCount, lastExecutionDateKey, lastSessionSummary } = item;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-card p-4">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={onOpen}
          className="min-w-0 flex-1 rounded-xl text-left outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <p className="truncate font-body text-base font-bold text-ink-900">{template.name}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {exerciseCount} {exerciseCount === 1 ? "exercício" : "exercícios"}
            {lastExecutionDateKey ? ` · Última vez ${formatRelativeDateKey(lastExecutionDateKey, todayDateKey())}` : ""}
          </p>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Mais ações para ${template.name}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
            >
              <MoreVerticalIcon className="size-5" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onDuplicate}>Duplicar</DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>Renomear</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {lastSessionSummary ? (
        <div className="flex flex-col gap-0.5 rounded-xl bg-ink-50 px-3 py-2">
          <p className="truncate text-xs font-semibold text-ink-700">{lastSessionSummary.exerciseNames.join(", ")}</p>
          <p className="text-xs text-ink-500">
            {lastSessionSummary.totalReps} repetições · {Math.round(lastSessionSummary.totalVolumeKg)} kg de carga total
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onOpen}
        className="flex min-h-11 items-center justify-center gap-1 rounded-full border-2 border-ink-200 text-sm font-bold text-ink-700 hover:bg-ink-50 outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
      >
        Abrir treino
        <ChevronRightIcon className="size-4" aria-hidden />
      </button>
    </div>
  );
}
