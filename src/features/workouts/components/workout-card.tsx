"use client";

import { MoreVerticalIcon } from "lucide-react";
import { MUSCLE_GROUP_LABELS } from "@/features/exercises/domain/types";
import { formatRelativeDateKey, todayDateKey } from "@/lib/date/local-date";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { WorkoutListItem } from "../hooks/use-workouts";

interface WorkoutCardProps {
  item: WorkoutListItem;
  onStart: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function WorkoutCard({ item, onStart, onEdit, onDuplicate, onRename, onDelete }: WorkoutCardProps) {
  const { template, exerciseCount, lastExecutionDateKey, lastSessionSummary } = item;

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-ink-100 bg-card p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-body text-base font-bold text-ink-900">{template.name}</p>
          <p className="truncate text-sm text-ink-500">
            {template.muscleGroups.map((g) => MUSCLE_GROUP_LABELS[g]).join(", ")}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label={`Mais ações para ${template.name}`}
              className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
            >
              <MoreVerticalIcon className="size-5" aria-hidden />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={onEdit}>Editar</DropdownMenuItem>
            <DropdownMenuItem onSelect={onDuplicate}>Duplicar</DropdownMenuItem>
            <DropdownMenuItem onSelect={onRename}>Renomear</DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink-500">
        <span>{exerciseCount} {exerciseCount === 1 ? "exercício" : "exercícios"}</span>
        <span>·</span>
        <span>~{template.estimatedDurationMinutes} min</span>
        {lastExecutionDateKey ? (
          <>
            <span>·</span>
            <span>Última vez {formatRelativeDateKey(lastExecutionDateKey, todayDateKey())}</span>
          </>
        ) : null}
      </div>

      {lastSessionSummary ? (
        <div className="flex flex-col gap-0.5 rounded-xl bg-ink-50 px-3 py-2">
          <p className="truncate text-xs font-semibold text-ink-700">{lastSessionSummary.exerciseNames.join(", ")}</p>
          <p className="text-xs text-ink-500">
            {lastSessionSummary.totalReps} repetições · {Math.round(lastSessionSummary.totalVolumeKg)} kg de carga total
          </p>
        </div>
      ) : null}

      <Button type="button" variant="accent" onClick={onStart}>
        Iniciar
      </Button>
    </div>
  );
}
