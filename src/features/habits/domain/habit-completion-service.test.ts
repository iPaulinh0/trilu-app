import { describe, expect, it, vi } from "vitest";
import { toggleHabitWithRollback } from "./habit-completion-service";
import type { HabitRepository } from "./habit-repository";

function makeHabit() {
  return {
    id: "habit-1",
    userId: "user-1",
    name: "Meditar",
    description: null,
    icon: "brain" as const,
    color: "violet" as const,
    scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("toggleHabitWithRollback", () => {
  it("applies the optimistic update immediately, before the repository resolves", async () => {
    const order: string[] = [];
    const habitRepository = {
      toggleForDate: vi.fn(async () => {
        order.push("repository-called");
        return { habit: makeHabit(), completed: true };
      }),
    } as unknown as HabitRepository;

    await toggleHabitWithRollback({
      habitRepository,
      habitId: "habit-1",
      dateKey: "2026-01-05",
      wasCompleted: false,
      onOptimisticUpdate: () => order.push("optimistic"),
      onSuccess: () => order.push("success"),
      onRollback: () => order.push("rollback"),
    });

    expect(order).toEqual(["optimistic", "repository-called", "success"]);
  });

  it("flips to the opposite of the current state", async () => {
    const habitRepository = {
      toggleForDate: vi.fn(async () => ({ habit: makeHabit(), completed: true })),
    } as unknown as HabitRepository;
    const optimisticValues: boolean[] = [];

    await toggleHabitWithRollback({
      habitRepository,
      habitId: "habit-1",
      dateKey: "2026-01-05",
      wasCompleted: false,
      onOptimisticUpdate: (next) => optimisticValues.push(next),
      onSuccess: () => {},
      onRollback: () => {},
    });

    expect(optimisticValues).toEqual([true]);
  });

  it("rolls back to the previous state and rethrows when the repository call fails", async () => {
    const habitRepository = {
      toggleForDate: vi.fn(async () => {
        throw new Error("network down");
      }),
    } as unknown as HabitRepository;
    const onSuccess = vi.fn();
    const rolledBackTo: boolean[] = [];

    await expect(
      toggleHabitWithRollback({
        habitRepository,
        habitId: "habit-1",
        dateKey: "2026-01-05",
        wasCompleted: false,
        onOptimisticUpdate: () => {},
        onSuccess,
        onRollback: (previous) => rolledBackTo.push(previous),
      }),
    ).rejects.toThrow("network down");

    expect(onSuccess).not.toHaveBeenCalled();
    expect(rolledBackTo).toEqual([false]);
  });

  it("never leaves data inconsistent: a failed undo restores the completed state", async () => {
    const habitRepository = {
      toggleForDate: vi.fn(async () => {
        throw new Error("offline");
      }),
    } as unknown as HabitRepository;
    const rolledBackTo: boolean[] = [];

    await expect(
      toggleHabitWithRollback({
        habitRepository,
        habitId: "habit-1",
        dateKey: "2026-01-05",
        wasCompleted: true,
        onOptimisticUpdate: () => {},
        onSuccess: () => {},
        onRollback: (previous) => rolledBackTo.push(previous),
      }),
    ).rejects.toThrow();

    expect(rolledBackTo).toEqual([true]);
  });
});
