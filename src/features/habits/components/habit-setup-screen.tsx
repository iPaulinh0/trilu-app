"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  HABIT_SUGGESTIONS,
  MAX_ACTIVE_HABITS,
  type CreateHabitInput,
  type HabitSuggestion,
} from "../domain/types";
import { HabitFormSheet, type HabitFormInitialValues } from "./habit-form-sheet";
import { HabitIcon } from "./habit-icon";
import { HABIT_COLOR_STYLES } from "./habit-color-styles";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Mascot } from "@/components/shared/mascot";
import { BottomActionArea } from "@/components/shared/bottom-action-area";
import { cn } from "@/lib/utils";

interface HabitSetupScreenProps {
  onFinish: (habits: CreateHabitInput[]) => Promise<void> | void;
  onSkip: () => void;
}

export function HabitSetupScreen({ onFinish, onSkip }: HabitSetupScreenProps) {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());
  const [customHabits, setCustomHabits] = useState<CreateHabitInput[]>([]);
  const [showCustomSheet, setShowCustomSheet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const totalSelected = selectedKeys.size + customHabits.length;
  const atLimit = totalSelected >= MAX_ACTIVE_HABITS;

  function toggleSuggestion(suggestion: HabitSuggestion) {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(suggestion.key)) {
        next.delete(suggestion.key);
      } else if (totalSelected < MAX_ACTIVE_HABITS) {
        next.add(suggestion.key);
      }
      return next;
    });
  }

  function buildHabitInputs(): CreateHabitInput[] {
    const fromSuggestions: CreateHabitInput[] = HABIT_SUGGESTIONS.filter((s) => selectedKeys.has(s.key)).map(
      (s) => ({
        name: s.name,
        description: s.description,
        icon: s.icon,
        color: s.color,
        scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6],
      }),
    );
    return [...fromSuggestions, ...customHabits];
  }

  async function handleStart() {
    setIsSaving(true);
    try {
      await onFinish(buildHabitInputs());
    } catch {
      toast.error("Não foi possível salvar seus hábitos agora. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  }

  const defaultCustomIcon: HabitFormInitialValues = { icon: "sparkles", color: "coral" };

  return (
    <div className="flex flex-1 flex-col gap-6">
      <Logo height={26} />

      <div className="flex flex-col items-center gap-3 text-center">
        <Mascot size={120} priority />
        <h1 className="text-2xl font-bold leading-snug text-ink-900">Que hábitos vão mover sua trilha?</h1>
        <p className="text-base leading-relaxed text-ink-700">
          Treino é uma parte do caminho. Escolha pequenas ações que você quer cumprir no dia a dia.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {HABIT_SUGGESTIONS.map((suggestion) => {
          const selected = selectedKeys.has(suggestion.key);
          const styles = HABIT_COLOR_STYLES[suggestion.color];
          return (
            <button
              key={suggestion.key}
              type="button"
              role="checkbox"
              aria-checked={selected}
              disabled={!selected && atLimit}
              onClick={() => toggleSuggestion(suggestion)}
              className={cn(
                "flex min-h-[56px] items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:opacity-40",
                selected ? "border-violet-500 bg-violet-50" : "border-ink-200 bg-card",
              )}
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", styles.bg, styles.text)}>
                <HabitIcon icon={suggestion.icon} className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-body text-base font-bold text-ink-900">{suggestion.name}</span>
                <span className="block truncate text-sm text-ink-500">{suggestion.description}</span>
              </span>
            </button>
          );
        })}

        {customHabits.map((habit, index) => {
          const styles = HABIT_COLOR_STYLES[habit.color];
          return (
            <div
              key={`custom-${index}-${habit.name}`}
              className="flex min-h-[56px] items-center gap-3 rounded-2xl border-2 border-violet-500 bg-violet-50 px-4 py-3"
            >
              <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-full", styles.bg, styles.text)}>
                <HabitIcon icon={habit.icon} className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-body text-base font-bold text-ink-900">{habit.name}</span>
                {habit.description ? (
                  <span className="block truncate text-sm text-ink-500">{habit.description}</span>
                ) : null}
              </span>
              <button
                type="button"
                aria-label={`Remover ${habit.name}`}
                onClick={() => setCustomHabits((prev) => prev.filter((_, i) => i !== index))}
                className="shrink-0 text-sm font-bold text-ink-500 hover:text-ink-700"
              >
                Remover
              </button>
            </div>
          );
        })}

        <button
          type="button"
          disabled={atLimit}
          onClick={() => setShowCustomSheet(true)}
          className="flex min-h-[52px] items-center justify-center rounded-2xl border-2 border-dashed border-violet-300 text-sm font-bold text-violet-600 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:opacity-40"
        >
          Criar meu próprio hábito
        </button>
      </div>

      {atLimit ? (
        <p className="text-center text-sm font-semibold text-ink-500">
          Você chegou ao limite de {MAX_ACTIVE_HABITS} hábitos por enquanto.
        </p>
      ) : null}

      <HabitFormSheet
        open={showCustomSheet}
        onOpenChange={setShowCustomSheet}
        mode="create"
        initialValues={defaultCustomIcon}
        onSubmit={(values) => {
          setCustomHabits((prev) => [...prev, values]);
        }}
      />

      <BottomActionArea>
        <Button type="button" variant="accent" size="lg" block loading={isSaving} onClick={handleStart}>
          Começar minha trilha
        </Button>
        <button
          type="button"
          onClick={onSkip}
          className="min-h-11 text-sm font-bold text-ink-500 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 rounded-md"
        >
          Configurar depois
        </button>
      </BottomActionArea>
    </div>
  );
}
