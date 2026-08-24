"use client";

import { useState } from "react";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, MoreVerticalIcon } from "lucide-react";
import { parseDecimalInput } from "@/lib/parse-decimal";
import { canCompleteSet } from "../domain/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { SetLog } from "../domain/types";

interface SetRowProps {
  set: SetLog;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onToggleComplete: () => void;
  onUpdate: (input: { weightKg?: number; repetitions?: number }) => void;
  onToggleWarmup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function SetRow({
  set,
  canMoveUp,
  canMoveDown,
  onToggleComplete,
  onUpdate,
  onToggleWarmup,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
}: SetRowProps) {
  const [weightText, setWeightText] = useState(String(set.weightKg));
  const [repsText, setRepsText] = useState(String(set.repetitions));
  const isCompleted = set.completedAt !== null;
  const label = `Série ${set.setNumber}`;

  function commitWeight() {
    const value = parseDecimalInput(weightText);
    if (value !== null && value >= 0) onUpdate({ weightKg: value });
    else setWeightText(String(set.weightKg));
  }

  function commitReps() {
    const value = Number(repsText);
    if (Number.isInteger(value) && value >= 0) onUpdate({ repetitions: value });
    else setRepsText(String(set.repetitions));
  }

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border px-2 py-2",
        isCompleted ? "border-mint-200 bg-mint-50" : "border-ink-100 bg-card",
      )}
    >
      <div className="flex w-16 shrink-0 flex-col items-start">
        <span className="text-xs font-bold text-ink-500">{label}</span>
        {set.isWarmup ? <span className="text-[10px] font-bold text-sun-700">Aquecimento</span> : null}
      </div>

      <label className="flex flex-1 items-center gap-1 text-sm">
        <span className="sr-only">Peso em quilogramas — {label}</span>
        <input
          type="text"
          inputMode="decimal"
          value={weightText}
          disabled={isCompleted}
          onChange={(e) => setWeightText(e.target.value)}
          onBlur={commitWeight}
          className="w-14 rounded-lg border-2 border-ink-200 bg-card px-1.5 py-1.5 text-center font-bold text-ink-900 disabled:opacity-70"
        />
        <span className="text-xs text-ink-500">kg</span>
      </label>

      <label className="flex flex-1 items-center gap-1 text-sm">
        <span className="sr-only">Repetições — {label}</span>
        <input
          type="number"
          inputMode="numeric"
          value={repsText}
          disabled={isCompleted}
          onChange={(e) => setRepsText(e.target.value)}
          onBlur={commitReps}
          className="w-14 rounded-lg border-2 border-ink-200 bg-card px-1.5 py-1.5 text-center font-bold text-ink-900 disabled:opacity-70"
        />
        <span className="text-xs text-ink-500">reps</span>
      </label>

      <button
        type="button"
        role="checkbox"
        aria-checked={isCompleted}
        aria-label={`Marcar ${label.toLowerCase()} como concluída`}
        disabled={!isCompleted && !canCompleteSet(Number(repsText))}
        onClick={onToggleComplete}
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:opacity-40",
          isCompleted ? "border-mint-500 bg-mint-500" : "border-ink-300 bg-transparent",
        )}
      >
        {isCompleted ? <CheckIcon className="size-5 text-white" aria-hidden /> : null}
      </button>

      <div className="flex flex-col">
        <button
          type="button"
          disabled={!canMoveUp || isCompleted}
          onClick={onMoveUp}
          aria-label={`Mover ${label.toLowerCase()} para cima`}
          className="flex size-6 items-center justify-center text-ink-400 disabled:opacity-20"
        >
          <ChevronUpIcon className="size-3.5" aria-hidden />
        </button>
        <button
          type="button"
          disabled={!canMoveDown || isCompleted}
          onClick={onMoveDown}
          aria-label={`Mover ${label.toLowerCase()} para baixo`}
          className="flex size-6 items-center justify-center text-ink-400 disabled:opacity-20"
        >
          <ChevronDownIcon className="size-3.5" aria-hidden />
        </button>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Mais ações para ${label.toLowerCase()}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50"
          >
            <MoreVerticalIcon className="size-4" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onToggleWarmup}>
            {set.isWarmup ? "Remover aquecimento" : "Marcar como aquecimento"}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onDuplicate}>Duplicar série</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            Excluir série
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
