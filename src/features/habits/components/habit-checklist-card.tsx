"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronDownIcon, PlusIcon } from "lucide-react";
import type { HabitChecklistItem as HabitChecklistItemModel } from "@/features/home/domain/types";
import type { CreateHabitInput, Habit, UpdateHabitInput } from "../domain/types";
import { HabitLimitReachedError } from "../domain/errors";
import { HabitChecklistItem } from "./habit-checklist-item";
import { HabitEmptyState } from "./habit-empty-state";
import { HabitFormSheet, type HabitFormInitialValues } from "./habit-form-sheet";
import { DeleteHabitDialog } from "./delete-habit-dialog";
import { HabitIcon } from "./habit-icon";
import { HABIT_COLOR_STYLES } from "./habit-color-styles";
import { cn } from "@/lib/utils";

interface HabitChecklistCardProps {
  items: HabitChecklistItemModel[];
  pausedHabits: Habit[];
  hasAnyHabitsConfigured: boolean;
  isHabitPending: (id: string) => boolean;
  onToggle: (id: string) => void;
  onCreate: (input: CreateHabitInput) => Promise<void>;
  onUpdate: (id: string, input: UpdateHabitInput) => Promise<void>;
  onPause: (id: string) => Promise<void>;
  onReactivate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

type SheetState = { mode: "create" } | { mode: "edit"; habit: Habit };

export function HabitChecklistCard({
  items,
  pausedHabits,
  hasAnyHabitsConfigured,
  isHabitPending,
  onToggle,
  onCreate,
  onUpdate,
  onPause,
  onReactivate,
  onDelete,
}: HabitChecklistCardProps) {
  const [sheet, setSheet] = useState<SheetState | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Habit | null>(null);
  const [showPaused, setShowPaused] = useState(false);

  function openCreate() {
    // The 8-active-habits cap is enforced by the repository (source of
    // truth); handleSubmit surfaces HabitLimitReachedError as a toast.
    setSheet({ mode: "create" });
  }

  async function handleSubmit(values: {
    name: string;
    description: string | null;
    icon: Habit["icon"];
    color: Habit["color"];
    scheduledWeekdays: number[];
  }) {
    try {
      if (sheet?.mode === "edit") {
        await onUpdate(sheet.habit.id, values);
        toast.success("Hábito atualizado.");
      } else {
        await onCreate(values);
        toast.success("Hábito adicionado à sua trilha.");
      }
    } catch (error) {
      if (error instanceof HabitLimitReachedError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar o hábito. Tente novamente.");
      }
      throw error;
    }
  }

  function editInitialValues(habit: Habit): HabitFormInitialValues {
    return {
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      color: habit.color,
      scheduledWeekdays: habit.scheduledWeekdays,
    };
  }

  return (
    <section className="flex flex-col gap-3 rounded-2xl bg-card p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-body text-xs font-bold tracking-[0.08em] text-ink-500">HÁBITOS DE HOJE</h2>
          <p className="mt-1 text-sm text-ink-500">Cada hábito concluído move você na trilha.</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex min-h-11 shrink-0 items-center gap-1 rounded-full bg-violet-50 px-3 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <PlusIcon className="size-4" aria-hidden />
          Adicionar
        </button>
      </div>

      {!hasAnyHabitsConfigured ? (
        <HabitEmptyState onAddFirstHabit={openCreate} />
      ) : items.length === 0 ? (
        <p className="rounded-2xl bg-ink-50 px-4 py-4 text-sm text-ink-500">
          Nenhum hábito programado para hoje. Aproveite para descansar ou adiante algo para amanhã.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <HabitChecklistItem
              key={item.habit.id}
              item={item}
              pending={isHabitPending(item.habit.id)}
              onToggle={() => onToggle(item.habit.id)}
              onEdit={() => setSheet({ mode: "edit", habit: item.habit })}
              onPause={async () => {
                try {
                  await onPause(item.habit.id);
                  toast.info(`"${item.habit.name}" foi pausado.`);
                } catch {
                  toast.error("Não foi possível pausar agora.");
                }
              }}
              onDelete={() => setDeleteTarget(item.habit)}
            />
          ))}
        </div>
      )}

      {pausedHabits.length > 0 ? (
        <div className="mt-1 border-t border-ink-100 pt-3">
          <button
            type="button"
            onClick={() => setShowPaused((v) => !v)}
            className="flex min-h-11 w-full items-center justify-between text-sm font-bold text-ink-500 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 rounded-md"
            aria-expanded={showPaused}
          >
            Hábitos pausados ({pausedHabits.length})
            <ChevronDownIcon className={cn("size-4 transition-transform", showPaused && "rotate-180")} aria-hidden />
          </button>
          {showPaused ? (
            <ul className="mt-2 flex flex-col gap-2">
              {pausedHabits.map((habit) => (
                <li
                  key={habit.id}
                  className="flex items-center gap-3 rounded-2xl bg-ink-50 px-3 py-2.5 opacity-80"
                >
                  <span
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full",
                      HABIT_COLOR_STYLES[habit.color].bg,
                      HABIT_COLOR_STYLES[habit.color].text,
                    )}
                  >
                    <HabitIcon icon={habit.icon} className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-700">{habit.name}</span>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        await onReactivate(habit.id);
                        toast.success(`"${habit.name}" foi reativado.`);
                      } catch (error) {
                        toast.error(
                          error instanceof HabitLimitReachedError
                            ? error.message
                            : "Não foi possível reativar agora.",
                        );
                      }
                    }}
                    className="shrink-0 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-600 hover:bg-violet-100"
                  >
                    Reativar
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <HabitFormSheet
        open={sheet !== null}
        onOpenChange={(open) => !open && setSheet(null)}
        mode={sheet?.mode ?? "create"}
        initialValues={sheet?.mode === "edit" ? editInitialValues(sheet.habit) : undefined}
        onSubmit={handleSubmit}
      />

      <DeleteHabitDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        habitName={deleteTarget?.name ?? ""}
        onConfirm={async () => {
          if (!deleteTarget) return;
          const name = deleteTarget.name;
          try {
            await onDelete(deleteTarget.id);
            toast.success(`"${name}" foi excluído.`);
          } catch {
            toast.error("Não foi possível excluir agora.");
          } finally {
            setDeleteTarget(null);
          }
        }}
      />
    </section>
  );
}
