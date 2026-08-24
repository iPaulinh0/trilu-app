import { describe, expect, it } from "vitest";
import { getLastAchievement, getNextMilestone } from "./milestones";
import type { TrailContribution, TrailGoal } from "./types";

function makeGoal(currentSteps: number): TrailGoal {
  return {
    id: "goal-1",
    userId: "user-1",
    title: "Minha trilha",
    currentSteps,
    targetSteps: 30,
    milestones: [5, 10, 15, 20, 25, 30],
    createdAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
  };
}

function makeContribution(dateKey: string, amount = 1): TrailContribution {
  return {
    id: `contrib-${dateKey}-${Math.random()}`,
    userId: "user-1",
    goalId: "goal-1",
    sourceType: "habit",
    sourceId: "habit-1",
    dateKey,
    amount,
    createdAt: `${dateKey}T08:00:00.000Z`,
  };
}

describe("getNextMilestone", () => {
  it("returns the first milestone ahead of the current steps", () => {
    expect(getNextMilestone(makeGoal(7))).toEqual({ nextMilestone: 10, stepsRemaining: 3 });
  });

  it("returns null once every milestone has been passed", () => {
    expect(getNextMilestone(makeGoal(30))).toEqual({ nextMilestone: null, stepsRemaining: null });
  });

  it("treats landing exactly on a milestone as having reached it", () => {
    expect(getNextMilestone(makeGoal(10))).toEqual({ nextMilestone: 15, stepsRemaining: 5 });
  });
});

describe("getLastAchievement", () => {
  it("returns null when no milestone has been crossed yet", () => {
    const contributions = [makeContribution("2026-01-01"), makeContribution("2026-01-02")];
    expect(getLastAchievement(makeGoal(2), contributions)).toBeNull();
  });

  it("finds the most recent milestone crossing, replaying contributions in date order", () => {
    const contributions = [
      makeContribution("2026-01-05"),
      makeContribution("2026-01-01"),
      makeContribution("2026-01-02"),
      makeContribution("2026-01-03"),
      makeContribution("2026-01-04"),
    ];
    const achievement = getLastAchievement(makeGoal(5), contributions);
    expect(achievement).toEqual({ title: "5 passos de constância", dateKey: "2026-01-05" });
  });

  it("reports the latest of multiple milestones crossed by a single contribution", () => {
    const contributions = [makeContribution("2026-01-10", 12)];
    const achievement = getLastAchievement(makeGoal(12), contributions);
    expect(achievement?.title).toBe("10 passos de constância");
  });
});
