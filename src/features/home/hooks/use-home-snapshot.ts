"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { habitRepository, homeRepository } from "@/lib/services";
import { todayDateKey } from "@/lib/date/local-date";
import { toggleHabitWithRollback } from "@/features/habits/domain/habit-completion-service";
import type { CreateHabitInput, UpdateHabitInput } from "@/features/habits/domain/types";
import type { HomeSnapshot } from "../domain/types";

export type HomeSnapshotStatus = "loading" | "error" | "ready";

export function useHomeSnapshot() {
  const [snapshot, setSnapshot] = useState<HomeSnapshot | null>(null);
  const [status, setStatus] = useState<HomeSnapshotStatus>("loading");
  const [pendingHabitIds, setPendingHabitIds] = useState<Set<string>>(new Set());

  async function load() {
    setStatus("loading");
    try {
      const next = await homeRepository.getHomeSnapshot(todayDateKey());
      setSnapshot(next);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    // Initial fetch on mount — setState happens inside load()'s async
    // continuation (after the localStorage read resolves), not
    // synchronously in this effect body.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  function setHabitPending(habitId: string, pending: boolean) {
    setPendingHabitIds((prev) => {
      const next = new Set(prev);
      if (pending) next.add(habitId);
      else next.delete(habitId);
      return next;
    });
  }

  async function toggleHabit(habitId: string) {
    if (!snapshot) return;
    const item = snapshot.habits.items.find((i) => i.habit.id === habitId);
    if (!item) return;
    const dateKey = todayDateKey();
    const wasCompleted = item.completedToday;

    setHabitPending(habitId, true);

    const applyLocalCompleted = (completed: boolean) => {
      setSnapshot((prev) =>
        prev
          ? {
              ...prev,
              habits: {
                ...prev.habits,
                items: prev.habits.items.map((i) =>
                  i.habit.id === habitId ? { ...i, completedToday: completed } : i,
                ),
              },
            }
          : prev,
      );
    };

    try {
      await toggleHabitWithRollback({
        habitRepository,
        habitId,
        dateKey,
        wasCompleted,
        onOptimisticUpdate: applyLocalCompleted,
        onSuccess: async () => {
          const fresh = await homeRepository.getHomeSnapshot(dateKey);
          setSnapshot(fresh);
          if (!wasCompleted) {
            toast.success("Você avançou mais 1 passo!", {
              action: { label: "Desfazer", onClick: () => void toggleHabit(habitId) },
            });
          }
        },
        onRollback: applyLocalCompleted,
      });
    } catch {
      toast.error("Não foi possível salvar agora. Tente novamente.");
    } finally {
      setHabitPending(habitId, false);
    }
  }

  async function createHabit(input: CreateHabitInput) {
    await habitRepository.create(input);
    await load();
  }

  async function updateHabit(id: string, input: UpdateHabitInput) {
    await habitRepository.update(id, input);
    await load();
  }

  async function pauseHabit(id: string) {
    await habitRepository.pause(id);
    await load();
  }

  async function reactivateHabit(id: string) {
    await habitRepository.reactivate(id);
    await load();
  }

  async function deleteHabit(id: string) {
    await habitRepository.delete(id);
    await load();
  }

  return {
    snapshot,
    status,
    reload: load,
    isHabitPending: (habitId: string) => pendingHabitIds.has(habitId),
    toggleHabit,
    createHabit,
    updateHabit,
    pauseHabit,
    reactivateHabit,
    deleteHabit,
  };
}
