import type { Habit, HabitEntry } from "@/features/habits/domain/types";

export interface DailyActivity {
  dateKey: string;
  /** At least one habit or a workout mission was scheduled that day. */
  hadScheduledAction: boolean;
  /** At least one scheduled habit was completed, or the mission was. */
  completedQualifyingAction: boolean;
}

/**
 * Reduces one day's raw data (which habits were scheduled, which entries
 * exist, whether a mission was scheduled/completed) into the two booleans
 * the streak calculation actually needs.
 */
export function buildDailyActivity(params: {
  dateKey: string;
  scheduledHabits: Habit[];
  entriesForDay: HabitEntry[];
  missionScheduled: boolean;
  missionCompleted: boolean;
}): DailyActivity {
  const { dateKey, scheduledHabits, entriesForDay, missionScheduled, missionCompleted } = params;
  const hadScheduledAction = scheduledHabits.length > 0 || missionScheduled;
  const completedQualifyingAction =
    entriesForDay.some((entry) => scheduledHabits.some((habit) => habit.id === entry.habitId)) || missionCompleted;
  return { dateKey, hadScheduledAction, completedQualifyingAction };
}
