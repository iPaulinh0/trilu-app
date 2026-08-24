import { describe, expect, it } from "vitest";
import {
  buildExerciseProgressSeries,
  isEvolutionChartUnlocked,
  isExerciseBodyweightOnly,
  summarizeMetric,
} from "./progress";
import type { ExerciseHistoryEntry } from "./workout-session-repository";
import type { SetLog } from "./types";

function makeSet(overrides: Partial<SetLog>): SetLog {
  return {
    id: "set",
    exerciseSessionId: "ex",
    setNumber: 1,
    weightKg: 20,
    repetitions: 10,
    restSeconds: 60,
    isWarmup: false,
    completedAt: "2026-01-01T10:00:00.000Z",
    createdAt: "2026-01-01T10:00:00.000Z",
    updatedAt: "2026-01-01T10:00:00.000Z",
    ...overrides,
  };
}

function makeEntry(sessionId: string, dateKey: string, sets: SetLog[]): ExerciseHistoryEntry {
  return { sessionId, dateKey, workoutNameSnapshot: "Treino A", setLogs: sets };
}

describe("buildExerciseProgressSeries", () => {
  it("produces one point per distinct session, sorted ascending by date", () => {
    const entries = [
      makeEntry("s2", "2026-01-05", [makeSet({ weightKg: 25, repetitions: 8 })]),
      makeEntry("s1", "2026-01-01", [makeSet({ weightKg: 20, repetitions: 10 })]),
    ];
    const series = buildExerciseProgressSeries(entries);
    expect(series.map((p) => p.dateKey)).toEqual(["2026-01-01", "2026-01-05"]);
    expect(series[0].maxLoadKg).toBe(20);
    expect(series[1].totalReps).toBe(8);
  });

  it("does not count three sets in the same session as three sessions", () => {
    const entry = makeEntry("s1", "2026-01-01", [
      makeSet({ id: "a" }),
      makeSet({ id: "b" }),
      makeSet({ id: "c" }),
    ]);
    const series = buildExerciseProgressSeries([entry]);
    expect(series).toHaveLength(1);
  });
});

describe("isEvolutionChartUnlocked", () => {
  it("stays locked below 3 distinct sessions", () => {
    expect(isEvolutionChartUnlocked(0)).toBe(false);
    expect(isEvolutionChartUnlocked(1)).toBe(false);
    expect(isEvolutionChartUnlocked(2)).toBe(false);
  });

  it("unlocks at exactly 3 distinct sessions", () => {
    expect(isEvolutionChartUnlocked(3)).toBe(true);
    expect(isEvolutionChartUnlocked(4)).toBe(true);
  });
});

describe("isExerciseBodyweightOnly", () => {
  it("is true when every session's max load is zero", () => {
    const points = buildExerciseProgressSeries([
      makeEntry("s1", "2026-01-01", [makeSet({ weightKg: 0 })]),
      makeEntry("s2", "2026-01-02", [makeSet({ weightKg: 0 })]),
    ]);
    expect(isExerciseBodyweightOnly(points)).toBe(true);
  });

  it("is false as soon as one session used real load", () => {
    const points = buildExerciseProgressSeries([
      makeEntry("s1", "2026-01-01", [makeSet({ weightKg: 0 })]),
      makeEntry("s2", "2026-01-02", [makeSet({ weightKg: 10 })]),
    ]);
    expect(isExerciseBodyweightOnly(points)).toBe(false);
  });
});

describe("summarizeMetric", () => {
  it("reports latest, best, and percent change", () => {
    const summary = summarizeMetric([20, 22, 25]);
    expect(summary.latest).toBe(25);
    expect(summary.best).toBe(25);
    expect(summary.percentChange).toBe(25);
  });

  it("never computes a percentage change from a zero baseline", () => {
    expect(summarizeMetric([0, 10, 20]).percentChange).toBeNull();
  });

  it("handles an empty series without throwing", () => {
    expect(summarizeMetric([])).toEqual({ latest: 0, best: 0, percentChange: null });
  });
});
