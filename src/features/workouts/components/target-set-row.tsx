"use client";

import { XIcon } from "lucide-react";
import type { UseFormRegisterReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FieldError } from "@/components/shared/field-error";

interface TargetSetRowProps {
  index: number;
  weightProps: UseFormRegisterReturn;
  repsProps: UseFormRegisterReturn;
  weightError?: string;
  repsError?: string;
  onRemove?: () => void;
}

/** One row of *planned* configuration (target weight + reps for a single set number) — distinct from SetRow, which logs what was actually performed during a session. */
export function TargetSetRow({ index, weightProps, repsProps, weightError, repsError, onRemove }: TargetSetRowProps) {
  const label = `Série ${index + 1}`;
  return (
    <div className="flex items-start gap-2 rounded-xl border border-ink-100 bg-card px-2 py-2">
      <span className="mt-2.5 w-14 shrink-0 text-xs font-bold text-ink-500">{label}</span>

      <div className="flex flex-1 flex-col gap-1">
        <label className="flex items-center gap-1 text-sm">
          <span className="sr-only">Carga em quilogramas, {label}</span>
          <Input type="text" inputMode="decimal" placeholder="0" className="h-10 text-center" {...weightProps} />
          <span className="shrink-0 text-xs text-ink-500">kg</span>
        </label>
        <FieldError message={weightError} />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <label className="flex items-center gap-1 text-sm">
          <span className="sr-only">Repetições, {label}</span>
          <Input type="number" inputMode="numeric" className="h-10 text-center" {...repsProps} />
          <span className="shrink-0 text-xs text-ink-500">reps</span>
        </label>
        <FieldError message={repsError} />
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remover ${label.toLowerCase()}`}
          className="mt-1 flex size-11 shrink-0 items-center justify-center rounded-full text-ink-400 hover:bg-ink-50 hover:text-[var(--status-danger)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
