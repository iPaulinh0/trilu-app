import { describe, expect, it } from "vitest";
import {
  computePercentChange,
  computeSessionMaxLoad,
  computeSessionTotalReps,
  computeSessionVolume,
  computeSetVolume,
  countCompletedSets,
  isBodyweightOnly,
} from "./volume";
import type { SetLog } from "./types";

function makeSet(overrides: Partial<SetLog>): SetLog {
  return {
    id: "set-1",
    exerciseSessionId: "ex-1",
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

describe("computeSetVolume", () => {
  it("multiplies weight by repetitions", () => {
    expect(computeSetVolume(makeSet({ weightKg: 20, repetitions: 10 }))).toBe(200);
  });
});

describe("computeSessionVolume / MaxLoad / TotalReps", () => {
  it("sums/maxes only over completed sets, ignoring drafts", () => {
    const sets = [
      makeSet({ id: "a", weightKg: 20, repetitions: 10, completedAt: "2026-01-01T10:00:00.000Z" }),
      makeSet({ id: "b", weightKg: 25, repetitions: 8, completedAt: "2026-01-01T10:05:00.000Z" }),
      makeSet({ id: "c", weightKg: 30, repetitions: 6, completedAt: null }), // not completed — must not count
    ];
    expect(computeSessionVolume(sets)).toBe(20 * 10 + 25 * 8);
    expect(computeSessionMaxLoad(sets)).toBe(25);
    expect(computeSessionTotalReps(sets)).toBe(18);
    expect(countCompletedSets(sets)).toBe(2);
  });

  it("returns 0 max load when nothing is completed", () => {
    expect(computeSessionMaxLoad([makeSet({ completedAt: null })])).toBe(0);
  });
});

describe("computePercentChange", () => {
  it("computes the percentage change between two values", () => {
    expect(computePercentChange(20, 25)).toBe(25);
    expect(computePercentChange(25, 20)).toBe(-20);
  });

  it("never computes a percentage when the first value is zero", () => {
    expect(computePercentChange(0, 10)).toBeNull();
  });
});

describe("isBodyweightOnly", () => {
  it("is true only when every recorded load is exactly zero", () => {
    expect(isBodyweightOnly([0, 0, 0])).toBe(true);
    expect(isBodyweightOnly([0, 5, 0])).toBe(false);
  });

  it("is false for an empty history (nothing to judge yet)", () => {
    expect(isBodyweightOnly([])).toBe(false);
  });
});
