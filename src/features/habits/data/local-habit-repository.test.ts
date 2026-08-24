import { describe, expect, it } from "vitest";
import { createInMemoryKeyValueStorage } from "@/test/in-memory-kv-storage";
import { createLocalTrailRepository } from "@/features/trail/data/local-trail-repository";
import { createLocalHabitRepository } from "./local-habit-repository";
import { HabitLimitReachedError, HabitNotFoundError } from "../domain/errors";
import { MAX_ACTIVE_HABITS } from "../domain/types";
import type { CreateHabitInput } from "../domain/types";

const USER_ID = "user-1";

function setup(kv = createInMemoryKeyValueStorage()) {
  const trailRepository = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
  const habitRepository = createLocalHabitRepository({ kv, getUserId: () => USER_ID, trailRepository });
  return { kv, trailRepository, habitRepository };
}

const MEDITATE_INPUT: CreateHabitInput = {
  name: "Meditar",
  description: "Meditar por 10 minutos",
  icon: "brain",
  color: "violet",
  scheduledWeekdays: [1, 3, 5], // Mon/Wed/Fri
};

describe("create", () => {
  it("creates an active habit", async () => {
    const { habitRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    expect(habit.isActive).toBe(true);
    expect(habit.userId).toBe(USER_ID);
    expect(habit.id).toBeTruthy();
  });

  it("rejects a 9th active habit", async () => {
    const { habitRepository } = setup();
    for (let i = 0; i < MAX_ACTIVE_HABITS; i += 1) {
      await habitRepository.create({ ...MEDITATE_INPUT, name: `Hábito ${i}` });
    }
    await expect(habitRepository.create(MEDITATE_INPUT)).rejects.toBeInstanceOf(HabitLimitReachedError);
  });
});

describe("listScheduledForDate", () => {
  it("returns only active habits scheduled for that weekday", async () => {
    const { habitRepository } = setup();
    await habitRepository.create(MEDITATE_INPUT); // Mon/Wed/Fri
    await habitRepository.create({ ...MEDITATE_INPUT, name: "Caminhar", scheduledWeekdays: [2, 4] }); // Tue/Thu

    // 2026-01-05 is a Monday.
    const monday = await habitRepository.listScheduledForDate("2026-01-05");
    expect(monday.map((h) => h.name)).toEqual(["Meditar"]);

    // 2026-01-06 is a Tuesday.
    const tuesday = await habitRepository.listScheduledForDate("2026-01-06");
    expect(tuesday.map((h) => h.name)).toEqual(["Caminhar"]);
  });

  it("excludes paused habits", async () => {
    const { habitRepository } = setup();
    const habit = await habitRepository.create({ ...MEDITATE_INPUT, scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6] });
    await habitRepository.pause(habit.id);
    const scheduled = await habitRepository.listScheduledForDate("2026-01-05");
    expect(scheduled).toHaveLength(0);
  });
});

describe("update", () => {
  it("changes the habit's fields without touching its completion history", async () => {
    const { habitRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    await habitRepository.toggleForDate(habit.id, "2026-01-05");

    const updated = await habitRepository.update(habit.id, { name: "Meditar 15min" });
    expect(updated.name).toBe("Meditar 15min");

    const stillCompleted = await habitRepository.isCompletedOnDate(habit.id, "2026-01-05");
    expect(stillCompleted).toBe(true);
  });

  it("throws for an unknown habit id", async () => {
    const { habitRepository } = setup();
    await expect(habitRepository.update("missing", { name: "x" })).rejects.toBeInstanceOf(HabitNotFoundError);
  });
});

describe("pause / reactivate", () => {
  it("pausing removes it from checklists but keeps past completions", async () => {
    const { habitRepository } = setup();
    const habit = await habitRepository.create({ ...MEDITATE_INPUT, scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6] });
    await habitRepository.toggleForDate(habit.id, "2026-01-05");

    await habitRepository.pause(habit.id);
    expect(await habitRepository.listScheduledForDate("2026-01-05")).toHaveLength(0);
    expect(await habitRepository.isCompletedOnDate(habit.id, "2026-01-05")).toBe(true);

    const reactivated = await habitRepository.reactivate(habit.id);
    expect(reactivated.isActive).toBe(true);
    expect(await habitRepository.listScheduledForDate("2026-01-05")).toHaveLength(1);
  });

  it("refuses to reactivate past the 8-habit cap", async () => {
    const { habitRepository } = setup();
    const paused = await habitRepository.create(MEDITATE_INPUT);
    await habitRepository.pause(paused.id);
    for (let i = 0; i < MAX_ACTIVE_HABITS; i += 1) {
      await habitRepository.create({ ...MEDITATE_INPUT, name: `Hábito ${i}` });
    }
    await expect(habitRepository.reactivate(paused.id)).rejects.toBeInstanceOf(HabitLimitReachedError);
  });
});

describe("delete", () => {
  it("removes the habit but preserves entries and trail steps already earned", async () => {
    const { habitRepository, trailRepository } = setup();
    const habit = await habitRepository.create({ ...MEDITATE_INPUT, scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6] });
    await habitRepository.toggleForDate(habit.id, "2026-01-05");
    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(1);

    await habitRepository.delete(habit.id);

    expect(await habitRepository.listAll()).toHaveLength(0);
    const goalAfterDelete = await trailRepository.getProgress(goal.id);
    expect(goalAfterDelete.currentSteps).toBe(1);
  });
});

describe("toggleForDate", () => {
  it("completing a habit adds exactly one trail contribution", async () => {
    const { habitRepository, trailRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    const result = await habitRepository.toggleForDate(habit.id, "2026-01-05");
    expect(result.completed).toBe(true);

    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(1);
  });

  it("toggling twice on the same day completes then reverts (no duplicate steps)", async () => {
    const { habitRepository, trailRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    await habitRepository.toggleForDate(habit.id, "2026-01-05");
    const second = await habitRepository.toggleForDate(habit.id, "2026-01-05");
    expect(second.completed).toBe(false);

    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(0);
  });

  it("repeated rapid toggles never produce more than one step per day", async () => {
    const { habitRepository, trailRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    await habitRepository.toggleForDate(habit.id, "2026-01-05"); // complete
    await habitRepository.toggleForDate(habit.id, "2026-01-05"); // undo
    await habitRepository.toggleForDate(habit.id, "2026-01-05"); // complete again

    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(1);
  });

  it("completing the same habit on two different days adds two steps", async () => {
    const { habitRepository, trailRepository } = setup();
    const habit = await habitRepository.create(MEDITATE_INPUT);
    await habitRepository.toggleForDate(habit.id, "2026-01-05");
    await habitRepository.toggleForDate(habit.id, "2026-01-06");

    const goal = await trailRepository.getOrCreateDefaultGoal();
    expect(goal.currentSteps).toBe(2);
  });

  it("never creates an orphaned entry when the trail contribution fails", async () => {
    const kv = createInMemoryKeyValueStorage();
    const realTrailRepository = createLocalTrailRepository({ kv, getUserId: () => USER_ID });
    const failingTrailRepository = {
      ...realTrailRepository,
      addContribution: async () => {
        throw new Error("trail unavailable");
      },
    };
    const habitRepository = createLocalHabitRepository({
      kv,
      getUserId: () => USER_ID,
      trailRepository: failingTrailRepository,
    });
    const habit = await habitRepository.create(MEDITATE_INPUT);

    await expect(habitRepository.toggleForDate(habit.id, "2026-01-05")).rejects.toThrow("trail unavailable");

    expect(await habitRepository.isCompletedOnDate(habit.id, "2026-01-05")).toBe(false);
  });
});

describe("persistence after reload", () => {
  it("a fresh repository instance backed by the same storage sees prior habits and entries", async () => {
    const kv = createInMemoryKeyValueStorage();
    const first = setup(kv);
    const habit = await first.habitRepository.create(MEDITATE_INPUT);
    await first.habitRepository.toggleForDate(habit.id, "2026-01-05");

    const second = setup(kv);
    const habits = await second.habitRepository.listAll();
    expect(habits).toHaveLength(1);
    expect(await second.habitRepository.isCompletedOnDate(habit.id, "2026-01-05")).toBe(true);
  });
});
