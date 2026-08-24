"use client";

import { CheckIcon, MoreVerticalIcon } from "lucide-react";
import type { HabitChecklistItem as HabitChecklistItemModel } from "@/features/home/domain/types";
import { HabitIcon } from "./habit-icon";
import { HABIT_COLOR_STYLES } from "./habit-color-styles";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface HabitChecklistItemProps {
  item: HabitChecklistItemModel;
  pending?: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onPause: () => void;
  onDelete: () => void;
}

export function HabitChecklistItem({ item, pending, onToggle, onEdit, onPause, onDelete }: HabitChecklistItemProps) {
  const { habit, completedToday } = item;
  const styles = HABIT_COLOR_STYLES[habit.color];
  const nameId = `habit-name-${habit.id}`;
  // "+1 passo" leads so it survives truncation on narrow screens even when
  // there's a longer description after it.
  const subtitle = habit.description ? `+1 passo · ${habit.description}` : "+1 passo";

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-card px-3 py-3">
      <button
        type="button"
        role="checkbox"
        aria-checked={completedToday}
        aria-labelledby={nameId}
        disabled={pending}
        onClick={onToggle}
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-150 ease-[var(--ease-standard)] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:opacity-60",
          completedToday ? "border-mint-500 bg-mint-500 motion-safe:animate-[trilu-pop_var(--dur-base)_var(--ease-bounce)]" : "border-ink-300 bg-transparent",
        )}
      >
        {completedToday ? <CheckIcon className="size-5 text-white" aria-hidden /> : null}
      </button>

      <span className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", styles.bg, styles.text)}>
        <HabitIcon icon={habit.icon} className="size-4" />
      </span>

      <div className="min-w-0 flex-1">
        <p
          id={nameId}
          className={cn(
            "truncate font-body text-base font-bold text-ink-900 transition-colors",
            completedToday && "text-ink-400 line-through decoration-2",
          )}
        >
          {habit.name}
        </p>
        <p className={cn("truncate text-xs font-semibold", completedToday ? "text-mint-600" : "text-ink-500")}>
          {subtitle}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Mais ações para ${habit.name}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
          >
            <MoreVerticalIcon className="size-5" aria-hidden />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={onEdit}>Editar</DropdownMenuItem>
          <DropdownMenuItem onSelect={onPause}>Pausar</DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onSelect={onDelete}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
