"use client";

import { ChevronDownIcon, ChevronUpIcon, XIcon } from "lucide-react";

interface WorkoutExerciseRowProps {
  name: string;
  defaultSets: number;
  targetRepMin: number;
  targetRepMax: number;
  defaultRestSeconds: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onEdit: () => void;
  onRemove: () => void;
}

export function WorkoutExerciseRow({
  name,
  defaultSets,
  targetRepMin,
  targetRepMax,
  defaultRestSeconds,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  onEdit,
  onRemove,
}: WorkoutExerciseRowProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-card p-3">
      <div className="flex flex-col">
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          aria-label={`Mover ${name} para cima`}
          className="flex size-7 items-center justify-center rounded-md text-ink-400 hover:bg-ink-50 disabled:opacity-30"
        >
          <ChevronUpIcon className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          aria-label={`Mover ${name} para baixo`}
          className="flex size-7 items-center justify-center rounded-md text-ink-400 hover:bg-ink-50 disabled:opacity-30"
        >
          <ChevronDownIcon className="size-4" aria-hidden />
        </button>
      </div>

      <button type="button" onClick={onEdit} className="min-w-0 flex-1 text-left">
        <p className="truncate font-body text-sm font-bold text-ink-900">{name}</p>
        <p className="truncate text-xs text-ink-500">
          {defaultSets} séries · {targetRepMin}-{targetRepMax} reps · {defaultRestSeconds}s descanso
        </p>
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remover ${name}`}
        className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-[var(--status-danger)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
      >
        <XIcon className="size-4" aria-hidden />
      </button>
    </div>
  );
}
