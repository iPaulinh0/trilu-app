"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { workoutSessionRepository } from "@/lib/services";
import { NoCompletedSetsError, SetIncompleteError } from "../domain/errors";
import type { AddSetInput, CompleteSessionResult } from "../domain/workout-session-repository";
import type { RestTimerState, WorkoutSession } from "../domain/types";

export type WorkoutSessionLoadStatus = "loading" | "notFound" | "ready";

export function useWorkoutSession(sessionId: string) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [status, setStatus] = useState<WorkoutSessionLoadStatus>("loading");

  async function reload() {
    const found = await workoutSessionRepository.getById(sessionId);
    setSession(found);
    setStatus(found ? "ready" : "notFound");
  }

  useEffect(() => {
    // Initial fetch for this sessionId — setStatus below is a synchronous
    // "start loading" flag; the actual data arrives via reload()'s await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus("loading");
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function toggleSet(setLogId: string) {
    try {
      await workoutSessionRepository.toggleSetCompleted(sessionId, setLogId);
      await reload();
    } catch (error) {
      if (error instanceof SetIncompleteError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível salvar a série agora.");
      }
    }
  }

  async function addSet(exerciseSessionId: string, input: AddSetInput) {
    try {
      await workoutSessionRepository.addSet(sessionId, exerciseSessionId, input);
      await reload();
    } catch {
      toast.error("Não foi possível adicionar a série agora.");
    }
  }

  async function updateSet(setLogId: string, input: Partial<AddSetInput>) {
    try {
      await workoutSessionRepository.updateSet(sessionId, setLogId, input);
      await reload();
    } catch {
      toast.error("Não foi possível salvar a série agora.");
    }
  }

  async function duplicateSet(setLogId: string) {
    try {
      await workoutSessionRepository.duplicateSet(sessionId, setLogId);
      await reload();
    } catch {
      toast.error("Não foi possível duplicar a série agora.");
    }
  }

  async function deleteSet(setLogId: string) {
    try {
      await workoutSessionRepository.deleteSet(sessionId, setLogId);
      await reload();
    } catch {
      toast.error("Não foi possível remover a série agora.");
    }
  }

  async function moveSet(exerciseSessionId: string, setLogId: string, direction: -1 | 1) {
    if (!session) return;
    const exerciseSession = session.exerciseSessions.find((es) => es.id === exerciseSessionId);
    if (!exerciseSession) return;
    const ids = exerciseSession.setLogs.map((s) => s.id);
    const index = ids.indexOf(setLogId);
    const target = index + direction;
    if (index === -1 || target < 0 || target >= ids.length) return;
    [ids[index], ids[target]] = [ids[target], ids[index]];
    try {
      await workoutSessionRepository.reorderSets(sessionId, exerciseSessionId, ids);
      await reload();
    } catch {
      toast.error("Não foi possível reordenar agora.");
    }
  }

  async function updateRestTimer(timer: RestTimerState | null) {
    await workoutSessionRepository.updateRestTimer(sessionId, timer);
    await reload();
  }

  async function cancelSession() {
    await workoutSessionRepository.cancelSession(sessionId);
    await reload();
  }

  async function saveAsDraft() {
    await workoutSessionRepository.saveAsDraft(sessionId);
    await reload();
  }

  async function completeSession(): Promise<CompleteSessionResult | null> {
    try {
      // Deliberately skip reload(): the caller shows the summary view (driven
      // by the returned result, not by `session`) immediately after this
      // resolves. Reloading here would flip session.status to "completed" a
      // render before the summary state is set, tripping the
      // completed/cancelled redirect effect and bouncing the user to /treinos
      // instead of the summary screen.
      return await workoutSessionRepository.completeSession(sessionId);
    } catch (error) {
      if (error instanceof NoCompletedSetsError) {
        toast.error(error.message);
      } else {
        toast.error("Não foi possível concluir o treino agora.");
      }
      return null;
    }
  }

  return {
    session,
    status,
    reload,
    toggleSet,
    addSet,
    updateSet,
    duplicateSet,
    deleteSet,
    moveSet,
    updateRestTimer,
    cancelSession,
    saveAsDraft,
    completeSession,
  };
}
