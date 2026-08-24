import { describe, expect, it } from "vitest";
import { buildDailyActivity } from "./daily-activity";
import type { Habit, HabitEntry } from "@/features/habits/domain/types";

function makeHabit(id: string): Habit {
  return {
    id,
    userId: "user-1",
    name: "Meditar",
    description: null,
    icon: "brain",
    color: "violet",
    scheduledWeekdays: [0, 1, 2, 3, 4, 5, 6],
    isActive: true,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

function makeEntry(habitId: string, dateKey: string): HabitEntry {
  return {
    id: `entry-${habitId}-${dateKey}`,
    habitId,
    userId: "user-1",
    dateKey,
    completedAt: `${dateKey}T08:00:00.000Z`,
    createdAt: `${dateKey}T08:00:00.000Z`,
    updatedAt: `${dateKey}T08:00:00.000Z`,
  };
}

describe("buildDailyActivity", () => {
  it("is a rest day when nothing at all was scheduled", () => {
    const activity = buildDailyActivity({
      dateKey: "2026-01-05",
      scheduledHabits: [],
      entriesForDay: [],
      missionScheduled: false,
      missionCompleted: false,
    });
    expect(activity).toEqual({ dateKey: "2026-01-05", hadScheduledAction: false, completedQualifyingAction: false });
  });

  it("qualifies when a scheduled habit was completed", () => {
    const habit = makeHabit("habit-1");
    const activity = buildDailyActivity({
      dateKey: "2026-01-05",
      scheduledHabits: [habit],
      entriesForDay: [makeEntry("habit-1", "2026-01-05")],
      missionScheduled: false,
      missionCompleted: false,
    });
    expect(activity.hadScheduledAction).toBe(true);
    expect(activity.completedQualifyingAction).toBe(true);
  });

  it("does not qualify when a habit was scheduled but not completed", () => {
    const habit = makeHabit("habit-1");
    const activity = buildDailyActivity({
      dateKey: "2026-01-05",
      scheduledHabits: [habit],
      entriesForDay: [],
      missionScheduled: false,
      missionCompleted: false,
    });
    expect(activity.hadScheduledAction).toBe(true);
    expect(activity.completedQualifyingAction).toBe(false);
  });

  it("ignores an entry for a habit that wasn't scheduled that day", () => {
    const habit = makeHabit("habit-1");
    const activity = buildDailyActivity({
      dateKey: "2026-01-05",
      scheduledHabits: [habit],
      entriesForDay: [makeEntry("some-other-habit", "2026-01-05")],
      missionScheduled: false,
      missionCompleted: false,
    });
    expect(activity.completedQualifyingAction).toBe(false);
  });

  it("qualifies via a completed workout mission even with no habits", () => {
    const activity = buildDailyActivity({
      dateKey: "2026-01-05",
      scheduledHabits: [],
      entriesForDay: [],
      missionScheduled: true,
      missionCompleted: true,
    });
    expect(activity.hadScheduledAction).toBe(true);
    expect(activity.completedQualifyingAction).toBe(true);
  });
});
