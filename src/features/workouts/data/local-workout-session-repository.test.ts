import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalTrailRepository } from "@/features/trail/data/local-trail-repository";
import { createLocalWorkoutSessionRepository } from "./local-workout-session-repository";
import { WorkoutSessionConflictError, NoCompletedSetsError, SetIncompleteError } from "../domain/errors";
import type { StartSessionExerciseSeed } from "../domain/workout-session-repository";

const USER_ID = "user-1";

function setup(kv = createInMemoryKeyValueStorage()) {
  const trailRepository = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
  const sessionRepository = createLocalWorkoutSessionRepository({ kv, getUserId: () => USER_ID, trailRepository });
  return { kv, trailRepository, sessionRepository };
}

const SUPINO_SEED: StartSessionExerciseSeed = {
  exerciseSource: "exercisedb",
  providerExerciseId: "ex-supino",
  customExerciseId: null,
  exerciseNameSnapshot: "Supino",
  suggestedSets: 2,
  suggestedRestSeconds: 60,
  notes: null,
};

async function startBasicSession(sessionRepository: ReturnType<typeof setup>["sessionRepository"]) {
  return sessionRepository.startSession("tpl-1", "Treino A", [SUPINO_SEED]);
}

describe("startSession", () => {
  it("seeds the configured number of not-yet-completed sets", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    expect(session.status).toBe("in_progress");
    expect(session.exerciseSessions).toHaveLength(1);
    const sets = session.exerciseSessions[0].setLogs;
    expect(sets).toHaveLength(2);
    expect(sets.every((s) => s.completedAt === null)).toBe(true);
  });

  it("refuses to start a second session while one is already active", async () => {
    const { sessionRepository } = setup();
    await startBasicSession(sessionRepository);
    await expect(startBasicSession(sessionRepository)).rejects.toBeInstanceOf(WorkoutSessionConflictError);
  });

  it("pre-fills suggested sets from the last completed performance, still uncompleted", async () => {
    const { sessionRepository } = setup();
    const first = await startBasicSession(sessionRepository);
    const setId = first.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(first.id, setId, { weightKg: 40, repetitions: 8 });
    await sessionRepository.toggleSetCompleted(first.id, setId);
    await sessionRepository.completeSession(first.id);

    const second = await startBasicSession(sessionRepository);
    const suggestedSet = second.exerciseSessions[0].setLogs[0];
    expect(suggestedSet.weightKg).toBe(40);
    expect(suggestedSet.repetitions).toBe(8);
    expect(suggestedSet.completedAt).toBeNull(); // never auto-completed
  });
});

describe("set registration", () => {
  it("registers weight and repetitions per set independently", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const [setA, setB] = session.exerciseSessions[0].setLogs;
    await sessionRepository.updateSet(session.id, setA.id, { weightKg: 22, repetitions: 12 });
    await sessionRepository.updateSet(session.id, setB.id, { weightKg: 16, repetitions: 8 });
    const reloaded = await sessionRepository.getById(session.id);
    const sets = reloaded!.exerciseSessions[0].setLogs;
    expect(sets.find((s) => s.id === setA.id)).toMatchObject({ weightKg: 22, repetitions: 12 });
    expect(sets.find((s) => s.id === setB.id)).toMatchObject({ weightKg: 16, repetitions: 8 });
  });

  it("adds a new set to an exercise", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const exerciseSessionId = session.exerciseSessions[0].id;
    const created = await sessionRepository.addSet(session.id, exerciseSessionId, {
      weightKg: 20,
      repetitions: 10,
      restSeconds: 60,
      isWarmup: false,
    });
    expect(created.setNumber).toBe(3);
    const reloaded = await sessionRepository.getById(session.id);
    expect(reloaded!.exerciseSessions[0].setLogs).toHaveLength(3);
  });

  it("deletes a set and renumbers the remaining ones", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const [setA, setB] = session.exerciseSessions[0].setLogs;
    await sessionRepository.deleteSet(session.id, setA.id);
    const reloaded = await sessionRepository.getById(session.id);
    const remaining = reloaded!.exerciseSessions[0].setLogs;
    expect(remaining).toHaveLength(1);
    expect(remaining[0].id).toBe(setB.id);
    expect(remaining[0].setNumber).toBe(1);
  });

  it("duplicates a set as a new, uncompleted entry", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const original = session.exerciseSessions[0].setLogs[0];
    await sessionRepository.updateSet(session.id, original.id, { weightKg: 30, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, original.id);
    const duplicated = await sessionRepository.duplicateSet(session.id, original.id);
    expect(duplicated.weightKg).toBe(30);
    expect(duplicated.repetitions).toBe(10);
    expect(duplicated.completedAt).toBeNull();
    expect(duplicated.id).not.toBe(original.id);
  });

  it("rejects completing a set with zero repetitions", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { repetitions: 0 });
    await expect(sessionRepository.toggleSetCompleted(session.id, setId)).rejects.toBeInstanceOf(SetIncompleteError);
  });

  it("un-completing a set is always allowed regardless of repetitions", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { repetitions: 5 });
    await sessionRepository.toggleSetCompleted(session.id, setId); // complete
    const uncompleted = await sessionRepository.toggleSetCompleted(session.id, setId); // undo
    expect(uncompleted.completedAt).toBeNull();
  });
});

describe("completeSession", () => {
  it("requires at least one completed set", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    await expect(sessionRepository.completeSession(session.id)).rejects.toBeInstanceOf(NoCompletedSetsError);
  });

  it("creates exactly one trail contribution for the session", async () => {
    const { sessionRepository, trailRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setId);

    await sessionRepository.completeSession(session.id);
    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(1);
  });

  it("prevents completing the same session twice (no duplicate contribution)", async () => {
    const { sessionRepository, trailRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setId);
    await sessionRepository.completeSession(session.id);

    await expect(sessionRepository.completeSession(session.id)).rejects.toThrow();
    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(1);
  });

  it("computes duration, reps, and volume only from completed sets", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const [setA, setB] = session.exerciseSessions[0].setLogs;
    await sessionRepository.updateSet(session.id, setA.id, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setA.id);
    await sessionRepository.updateSet(session.id, setB.id, { weightKg: 99, repetitions: 99 }); // left incomplete

    const result = await sessionRepository.completeSession(session.id);
    expect(result.totalCompletedSets).toBe(1);
    expect(result.totalReps).toBe(10);
    expect(result.totalVolumeKg).toBe(200);
    expect(result.durationSeconds).toBeGreaterThanOrEqual(0);
  });

  it("reports a personal record when a session's max load beats every prior session", async () => {
    const { sessionRepository } = setup();
    const first = await startBasicSession(sessionRepository);
    await sessionRepository.updateSet(first.id, first.exerciseSessions[0].setLogs[0].id, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(first.id, first.exerciseSessions[0].setLogs[0].id);
    await sessionRepository.completeSession(first.id);

    const second = await startBasicSession(sessionRepository);
    await sessionRepository.updateSet(second.id, second.exerciseSessions[0].setLogs[0].id, { weightKg: 30, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(second.id, second.exerciseSessions[0].setLogs[0].id);
    const result = await sessionRepository.completeSession(second.id);

    expect(result.personalRecords).toEqual([{ exerciseNameSnapshot: "Supino", weightKg: 30 }]);
  });
});

describe("getActiveSession (session recovery)", () => {
  it("finds the in-progress session after a simulated reload (fresh repository instance)", async () => {
    const kv = createInMemoryKeyValueStorage();
    const first = setup(kv);
    const started = await startBasicSession(first.sessionRepository);

    const second = setup(kv);
    const recovered = await second.sessionRepository.getActiveSession();
    expect(recovered?.id).toBe(started.id);
  });

  it("returns null once the session is completed", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setId);
    await sessionRepository.completeSession(session.id);
    expect(await sessionRepository.getActiveSession()).toBeNull();
  });
});

describe("getLastCompletedSessionSummaryForTemplate", () => {
  it("returns null when the template has no completed session", async () => {
    const { sessionRepository } = setup();
    expect(await sessionRepository.getLastCompletedSessionSummaryForTemplate("tpl-1")).toBeNull();
  });

  it("summarizes exercises, reps, and volume from the most recent completed session only", async () => {
    const { sessionRepository } = setup();
    const first = await startBasicSession(sessionRepository);
    await sessionRepository.updateSet(first.id, first.exerciseSessions[0].setLogs[0].id, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(first.id, first.exerciseSessions[0].setLogs[0].id);
    await sessionRepository.completeSession(first.id);

    const second = await startBasicSession(sessionRepository);
    await sessionRepository.updateSet(second.id, second.exerciseSessions[0].setLogs[0].id, { weightKg: 40, repetitions: 8 });
    await sessionRepository.toggleSetCompleted(second.id, second.exerciseSessions[0].setLogs[0].id);
    await sessionRepository.completeSession(second.id);

    const summary = await sessionRepository.getLastCompletedSessionSummaryForTemplate("tpl-1");
    expect(summary).toMatchObject({ exerciseNames: ["Supino"], totalReps: 8, totalVolumeKg: 320 });
  });

  it("excludes exercises with no completed sets from the exercise name list", async () => {
    const { sessionRepository } = setup();
    const session = await sessionRepository.startSession("tpl-2", "Treino B", [
      SUPINO_SEED,
      { ...SUPINO_SEED, providerExerciseId: "ex-crucifixo", exerciseNameSnapshot: "Crucifixo" },
    ]);
    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setId);
    await sessionRepository.completeSession(session.id);

    const summary = await sessionRepository.getLastCompletedSessionSummaryForTemplate("tpl-2");
    expect(summary?.exerciseNames).toEqual(["Supino"]);
  });
});

describe("listCompletedSessionsForExercise (history)", () => {
  it("only includes completed sessions, never drafts or in-progress ones", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    const identity = {
      exerciseSource: "exercisedb" as const,
      providerExerciseId: "ex-supino",
      customExerciseId: null,
    };

    expect(await sessionRepository.listCompletedSessionsForExercise(identity)).toHaveLength(0);

    const setId = session.exerciseSessions[0].setLogs[0].id;
    await sessionRepository.updateSet(session.id, setId, { weightKg: 20, repetitions: 10 });
    await sessionRepository.toggleSetCompleted(session.id, setId);
    await sessionRepository.completeSession(session.id);

    const history = await sessionRepository.listCompletedSessionsForExercise(identity);
    expect(history).toHaveLength(1);
    expect(history[0].setLogs.every((s) => s.completedAt !== null)).toBe(true);
  });

  it("a cancelled session never appears in history", async () => {
    const { sessionRepository } = setup();
    const session = await startBasicSession(sessionRepository);
    await sessionRepository.cancelSession(session.id);
    const history = await sessionRepository.listCompletedSessionsForExercise({
      exerciseSource: "exercisedb",
      providerExerciseId: "ex-supino",
      customExerciseId: null,
    });
    expect(history).toHaveLength(0);
  });
});
