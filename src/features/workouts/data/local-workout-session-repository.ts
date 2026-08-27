import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createId } from "@/lib/id";
import { toDateKey } from "@/lib/date/local-date";
import type { TrailRepository } from "@/features/trail/domain/trail-repository";
import { canCompleteSet } from "../domain/schema";
import { WorkoutSessionConflictError, NoCompletedSetsError, SetIncompleteError } from "../domain/errors";
import { computeSessionMaxLoad, computeSessionTotalReps, computeSessionVolume } from "../domain/volume";
import { sameExercise } from "../domain/types";
import type { ExerciseIdentity, ExerciseSession, RestTimerState, SetLog, WorkoutSession } from "../domain/types";
import type {
  AddSetInput,
  CompleteSessionResult,
  ExerciseHistoryEntry,
  LastSessionSummary,
  StartSessionExerciseSeed,
  TodaysWorkoutSummary,
  WorkoutSessionRepository,
} from "../domain/workout-session-repository";

const SESSIONS_KEY = "trilu.workout-sessions.v1";

export interface LocalWorkoutSessionRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
  trailRepository: TrailRepository;
}

export function createLocalWorkoutSessionRepository({
  kv,
  getUserId,
  trailRepository,
}: LocalWorkoutSessionRepositoryDeps): WorkoutSessionRepository {
  const sessions = createCollectionStorage<WorkoutSession>(kv, SESSIONS_KEY);

  function requireSession(sessionId: string): WorkoutSession {
    const session = sessions.getAll().find((s) => s.id === sessionId && s.userId === getUserId());
    if (!session) throw new Error("Sessão de treino não encontrada.");
    return session;
  }

  function saveSession(updated: WorkoutSession) {
    sessions.setAll(sessions.getAll().map((s) => (s.id === updated.id ? updated : s)));
  }

  function mutateSession(sessionId: string, mutator: (session: WorkoutSession) => WorkoutSession): WorkoutSession {
    const session = requireSession(sessionId);
    const mutated = mutator(session);
    const withTimestamp: WorkoutSession = { ...mutated, updatedAt: new Date().toISOString() };
    saveSession(withTimestamp);
    return withTimestamp;
  }

  function findLastPerformance(
    exercise: ExerciseIdentity,
  ): { weightKg: number; repetitions: number; dateKey: string } | null {
    const userId = getUserId();
    const completedSessions = sessions
      .getAll()
      .filter((s) => s.userId === userId && s.status === "completed" && s.completedAt)
      .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));

    for (const session of completedSessions) {
      const exerciseSession = session.exerciseSessions.find((es) => sameExercise(es, exercise));
      if (!exerciseSession) continue;
      const workingSets = exerciseSession.setLogs.filter((s) => s.completedAt !== null && !s.isWarmup);
      if (workingSets.length === 0) continue;
      const heaviest = workingSets.reduce((max, s) => (s.weightKg > max.weightKg ? s : max), workingSets[0]);
      return { weightKg: heaviest.weightKg, repetitions: heaviest.repetitions, dateKey: toDateKey(new Date(session.completedAt as string)) };
    }
    return null;
  }

  function getPriorMaxLoad(exercise: ExerciseIdentity, excludeSessionId: string): number {
    const userId = getUserId();
    let max = 0;
    for (const session of sessions.getAll()) {
      if (session.userId !== userId || session.status !== "completed" || session.id === excludeSessionId) continue;
      const exerciseSession = session.exerciseSessions.find((es) => sameExercise(es, exercise));
      if (!exerciseSession) continue;
      max = Math.max(max, computeSessionMaxLoad(exerciseSession.setLogs));
    }
    return max;
  }

  return {
    async getActiveSession() {
      const userId = getUserId();
      return (
        sessions.getAll().find((s) => s.userId === userId && (s.status === "draft" || s.status === "in_progress")) ??
        null
      );
    },

    async getById(sessionId) {
      return sessions.getAll().find((s) => s.id === sessionId && s.userId === getUserId()) ?? null;
    },

    async startSession(workoutTemplateId, workoutName, exercises: StartSessionExerciseSeed[]) {
      const userId = getUserId();
      const active = sessions
        .getAll()
        .find((s) => s.userId === userId && (s.status === "draft" || s.status === "in_progress"));
      if (active) throw new WorkoutSessionConflictError();

      const sessionId = createId("session");
      const now = new Date().toISOString();

      const exerciseSessions: ExerciseSession[] = exercises.map((seed, index) => {
        const identity: ExerciseIdentity = {
          exerciseSource: seed.exerciseSource,
          providerExerciseId: seed.providerExerciseId,
          customExerciseId: seed.customExerciseId,
        };
        const last = findLastPerformance(identity);
        const setLogs: SetLog[] = Array.from({ length: seed.suggestedSets }, (_, setIndex) => ({
          id: createId("set"),
          exerciseSessionId: "", // patched below once known
          setNumber: setIndex + 1,
          weightKg: last?.weightKg ?? 0,
          repetitions: last?.repetitions ?? 0,
          restSeconds: seed.suggestedRestSeconds,
          isWarmup: false,
          completedAt: null,
          createdAt: now,
          updatedAt: now,
        }));
        const exerciseSessionId = createId("exsess");
        return {
          id: exerciseSessionId,
          workoutSessionId: sessionId,
          exerciseSource: seed.exerciseSource,
          providerExerciseId: seed.providerExerciseId,
          customExerciseId: seed.customExerciseId,
          exerciseNameSnapshot: seed.exerciseNameSnapshot,
          position: index,
          notes: seed.notes,
          setLogs: setLogs.map((s) => ({ ...s, exerciseSessionId })),
        };
      });

      const session: WorkoutSession = {
        id: sessionId,
        userId,
        workoutTemplateId,
        workoutNameSnapshot: workoutName,
        status: "in_progress",
        startedAt: now,
        completedAt: null,
        durationSeconds: null,
        createdAt: now,
        updatedAt: now,
        restTimer: null,
        exerciseSessions,
      };
      sessions.setAll([...sessions.getAll(), session]);
      return session;
    },

    async addSet(sessionId, exerciseSessionId, input: AddSetInput) {
      let created!: SetLog;
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => {
          if (es.id !== exerciseSessionId) return es;
          const now = new Date().toISOString();
          created = {
            id: createId("set"),
            exerciseSessionId,
            setNumber: es.setLogs.length + 1,
            weightKg: input.weightKg,
            repetitions: input.repetitions,
            restSeconds: input.restSeconds,
            isWarmup: input.isWarmup,
            completedAt: null,
            createdAt: now,
            updatedAt: now,
          };
          return { ...es, setLogs: [...es.setLogs, created] };
        }),
      }));
      return created;
    },

    async updateSet(sessionId, setLogId, input) {
      let updated!: SetLog;
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => ({
          ...es,
          setLogs: es.setLogs.map((s) => {
            if (s.id !== setLogId) return s;
            updated = { ...s, ...input, updatedAt: new Date().toISOString() };
            return updated;
          }),
        })),
      }));
      return updated;
    },

    async duplicateSet(sessionId, setLogId) {
      let created!: SetLog;
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => {
          const source = es.setLogs.find((s) => s.id === setLogId);
          if (!source) return es;
          const now = new Date().toISOString();
          created = { ...source, id: createId("set"), setNumber: es.setLogs.length + 1, completedAt: null, createdAt: now, updatedAt: now };
          return { ...es, setLogs: [...es.setLogs, created] };
        }),
      }));
      return created;
    },

    async deleteSet(sessionId, setLogId) {
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => ({
          ...es,
          setLogs: es.setLogs.filter((s) => s.id !== setLogId).map((s, i) => ({ ...s, setNumber: i + 1 })),
        })),
      }));
    },

    async reorderSets(sessionId, exerciseSessionId, orderedSetLogIds) {
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => {
          if (es.id !== exerciseSessionId) return es;
          const byId = new Map(es.setLogs.map((s) => [s.id, s] as const));
          const reordered = orderedSetLogIds
            .map((id) => byId.get(id))
            .filter((s): s is SetLog => !!s)
            .map((s, i) => ({ ...s, setNumber: i + 1 }));
          return { ...es, setLogs: reordered };
        }),
      }));
    },

    async toggleSetCompleted(sessionId, setLogId) {
      let updated!: SetLog;
      mutateSession(sessionId, (session) => ({
        ...session,
        exerciseSessions: session.exerciseSessions.map((es) => ({
          ...es,
          setLogs: es.setLogs.map((s) => {
            if (s.id !== setLogId) return s;
            if (s.completedAt === null && !canCompleteSet(s.repetitions)) throw new SetIncompleteError();
            updated = { ...s, completedAt: s.completedAt === null ? new Date().toISOString() : null, updatedAt: new Date().toISOString() };
            return updated;
          }),
        })),
      }));
      return updated;
    },

    async updateRestTimer(sessionId, timer: RestTimerState | null) {
      mutateSession(sessionId, (session) => ({ ...session, restTimer: timer }));
    },

    async saveAsDraft(sessionId) {
      mutateSession(sessionId, (session) => ({ ...session, status: "draft" }));
    },

    async cancelSession(sessionId) {
      mutateSession(sessionId, (session) => ({ ...session, status: "cancelled", restTimer: null }));
    },

    async completeSession(sessionId): Promise<CompleteSessionResult> {
      const session = requireSession(sessionId);
      if (session.status === "completed") throw new Error("Este treino já foi concluído.");

      const allSets = session.exerciseSessions.flatMap((es) => es.setLogs);
      const completedSets = allSets.filter((s) => s.completedAt !== null);
      if (completedSets.length === 0) throw new NoCompletedSetsError();

      const personalRecords: { exerciseNameSnapshot: string; weightKg: number }[] = [];
      for (const es of session.exerciseSessions) {
        const sessionMax = computeSessionMaxLoad(es.setLogs);
        if (sessionMax <= 0) continue;
        const priorMax = getPriorMaxLoad(es, sessionId);
        if (sessionMax > priorMax) personalRecords.push({ exerciseNameSnapshot: es.exerciseNameSnapshot, weightKg: sessionMax });
      }

      const now = new Date();
      const durationSeconds = Math.max(1, Math.round((now.getTime() - new Date(session.startedAt).getTime()) / 1000));
      const completed: WorkoutSession = {
        ...session,
        status: "completed",
        completedAt: now.toISOString(),
        durationSeconds,
        restTimer: null,
        updatedAt: now.toISOString(),
      };
      saveSession(completed);

      const dateKey = toDateKey(now);
      const goal = await trailRepository.getOrCreateDefaultGoal();
      await trailRepository.addContribution({
        goalId: goal.id,
        sourceType: "workout",
        sourceId: sessionId,
        dateKey,
        amount: 1,
      });

      return {
        session: completed,
        durationSeconds,
        totalCompletedSets: completedSets.length,
        totalReps: computeSessionTotalReps(allSets),
        totalVolumeKg: computeSessionVolume(allSets),
        stepEarned: true,
        personalRecords,
      };
    },

    async deleteCompletedSession(sessionId) {
      const session = requireSession(sessionId);
      if (session.status !== "completed") throw new Error("Só é possível excluir treinos já concluídos.");

      const dateKey = toDateKey(new Date(session.completedAt as string));
      const goal = await trailRepository.getOrCreateDefaultGoal();
      await trailRepository.revertContribution({ goalId: goal.id, sourceType: "workout", sourceId: sessionId, dateKey });

      sessions.setAll(sessions.getAll().filter((s) => s.id !== sessionId));
    },

    async getLastPerformance(exercise) {
      return findLastPerformance(exercise);
    },

    async getLastCompletedDateKeyForTemplate(workoutTemplateId) {
      const userId = getUserId();
      const dateKeys = sessions
        .getAll()
        .filter((s) => s.userId === userId && s.status === "completed" && s.workoutTemplateId === workoutTemplateId && s.completedAt)
        .map((s) => toDateKey(new Date(s.completedAt as string)))
        .sort();
      return dateKeys.length > 0 ? dateKeys[dateKeys.length - 1] : null;
    },

    async getTrainingDaysInRange(startDateKey, endDateKeyInclusive) {
      const userId = getUserId();
      return sessions
        .getAll()
        .filter((s) => s.userId === userId && s.status === "completed" && s.completedAt)
        .map((s) => ({
          dateKey: toDateKey(new Date(s.completedAt as string)),
          workoutTemplateId: s.workoutTemplateId,
          workoutNameSnapshot: s.workoutNameSnapshot,
        }))
        .filter((e) => e.dateKey >= startDateKey && e.dateKey <= endDateKeyInclusive);
    },

    async getLastCompletedSessionSummaryForTemplate(workoutTemplateId): Promise<LastSessionSummary | null> {
      const userId = getUserId();
      // Ties on completedAt (same millisecond) resolve to the later array
      // entry rather than via Array.sort, which would keep the earlier one
      // on a stable sort.
      let latest: WorkoutSession | undefined;
      for (const s of sessions.getAll()) {
        if (s.userId !== userId || s.status !== "completed" || s.workoutTemplateId !== workoutTemplateId || !s.completedAt) continue;
        if (!latest || s.completedAt >= (latest.completedAt as string)) latest = s;
      }
      if (!latest) return null;
      const allSets = latest.exerciseSessions.flatMap((es) => es.setLogs);
      const exerciseNames = latest.exerciseSessions
        .filter((es) => es.setLogs.some((s) => s.completedAt !== null))
        .map((es) => es.exerciseNameSnapshot);
      return {
        dateKey: toDateKey(new Date(latest.completedAt as string)),
        exerciseNames,
        totalReps: computeSessionTotalReps(allSets),
        totalVolumeKg: computeSessionVolume(allSets),
      };
    },

    async getTodaysWorkoutSummaries(dateKey): Promise<TodaysWorkoutSummary[]> {
      const userId = getUserId();
      return sessions
        .getAll()
        .map((s, index) => ({ s, index }))
        .filter(
          ({ s }) => s.userId === userId && s.status === "completed" && s.completedAt && toDateKey(new Date(s.completedAt)) === dateKey,
        )
        // Ties on completedAt (same millisecond) resolve to whichever was
        // added later — Array.sort is stable, so on its own it would keep
        // the earlier one first, the opposite of "most recent first".
        .sort((a, b) => {
          const byDate = (b.s.completedAt as string).localeCompare(a.s.completedAt as string);
          return byDate !== 0 ? byDate : b.index - a.index;
        })
        .map(({ s }) => {
          const allSets = s.exerciseSessions.flatMap((es) => es.setLogs);
          const exerciseNames = s.exerciseSessions
            .filter((es) => es.setLogs.some((set) => set.completedAt !== null))
            .map((es) => es.exerciseNameSnapshot);
          return {
            sessionId: s.id,
            workoutName: s.workoutNameSnapshot,
            durationSeconds: s.durationSeconds ?? 0,
            exerciseNames,
            totalReps: computeSessionTotalReps(allSets),
            totalVolumeKg: computeSessionVolume(allSets),
          };
        });
    },

    async listCompletedSessionsForExercise(exercise): Promise<ExerciseHistoryEntry[]> {
      const userId = getUserId();
      const entries: ExerciseHistoryEntry[] = [];
      for (const session of sessions.getAll()) {
        if (session.userId !== userId || session.status !== "completed" || !session.completedAt) continue;
        const exerciseSession = session.exerciseSessions.find((es) => sameExercise(es, exercise));
        if (!exerciseSession) continue;
        const completedSetLogs = exerciseSession.setLogs.filter((s) => s.completedAt !== null);
        if (completedSetLogs.length === 0) continue;
        entries.push({
          sessionId: session.id,
          dateKey: toDateKey(new Date(session.completedAt)),
          workoutNameSnapshot: session.workoutNameSnapshot,
          setLogs: completedSetLogs,
        });
      }
      return entries.sort((a, b) => a.dateKey.localeCompare(b.dateKey));
    },
  };
}
