import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalTrailRepository } from "./local-trail-repository";

const USER_ID = "user-1";

function setup() {
  const kv = createInMemoryKeyValueStorage();
  const repo = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
  return { kv, repo };
}

describe("createLocalTrailRepository", () => {
  it("creates a default goal on first access and reuses it afterwards", async () => {
    const { repo } = setup();
    const first = await repo.getOrCreateDefaultGoal();
    const second = await repo.getOrCreateDefaultGoal();
    expect(first.id).toBe(second.id);
    expect(first.currentSteps).toBe(0);
  });

  it("adds a contribution and increments currentSteps", async () => {
    const { repo } = setup();
    const goal = await repo.getOrCreateDefaultGoal();
    const { goal: updated } = await repo.addContribution({
      goalId: goal.id,
      sourceType: "habit",
      sourceId: "habit-1",
      dateKey: "2026-01-05",
      amount: 1,
    });
    expect(updated.currentSteps).toBe(1);
  });

  it("never counts the same logical contribution twice (idempotent)", async () => {
    const { repo } = setup();
    const goal = await repo.getOrCreateDefaultGoal();
    const input = {
      goalId: goal.id,
      sourceType: "habit" as const,
      sourceId: "habit-1",
      dateKey: "2026-01-05",
      amount: 1,
    };
    await repo.addContribution(input);
    const { goal: afterSecond } = await repo.addContribution(input);
    expect(afterSecond.currentSteps).toBe(1);
  });

  it("reverts a contribution and decrements currentSteps", async () => {
    const { repo } = setup();
    const goal = await repo.getOrCreateDefaultGoal();
    const input = {
      goalId: goal.id,
      sourceType: "habit" as const,
      sourceId: "habit-1",
      dateKey: "2026-01-05",
      amount: 1,
    };
    await repo.addContribution(input);
    const { goal: reverted } = await repo.revertContribution(input);
    expect(reverted.currentSteps).toBe(0);
  });

  it("reverting a contribution that doesn't exist is a no-op", async () => {
    const { repo } = setup();
    const goal = await repo.getOrCreateDefaultGoal();
    const { goal: unchanged } = await repo.revertContribution({
      goalId: goal.id,
      sourceType: "habit",
      sourceId: "never-contributed",
      dateKey: "2026-01-05",
    });
    expect(unchanged.currentSteps).toBe(0);
  });

  it("never lets currentSteps go negative", async () => {
    const { repo } = setup();
    const goal = await repo.getOrCreateDefaultGoal();
    await repo.revertContribution({
      goalId: goal.id,
      sourceType: "habit",
      sourceId: "habit-1",
      dateKey: "2026-01-05",
    });
    const progress = await repo.getProgress(goal.id);
    expect(progress.currentSteps).toBe(0);
  });

  it("persists across a fresh repository instance backed by the same storage (reload)", async () => {
    const kv = createInMemoryKeyValueStorage();
    const repoA = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
    const goal = await repoA.getOrCreateDefaultGoal();
    await repoA.addContribution({
      goalId: goal.id,
      sourceType: "habit",
      sourceId: "habit-1",
      dateKey: "2026-01-05",
      amount: 1,
    });

    const repoB = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
    const reloaded = await repoB.getOrCreateDefaultGoal();
    expect(reloaded.id).toBe(goal.id);
    expect(reloaded.currentSteps).toBe(1);
  });

  it("uses the provided default title for a brand-new goal", async () => {
    const kv = createInMemoryKeyValueStorage();
    const repo = createLocalTrailRepository({
      kv,
      getUserId: () => USER_ID,
      getDefaultTitle: () => "Voltar à rotina",
    });
    const goal = await repo.getOrCreateDefaultGoal();
    expect(goal.title).toBe("Voltar à rotina");
  });
});
