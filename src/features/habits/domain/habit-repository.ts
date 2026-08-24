import type { CreateHabitInput, Habit, HabitEntry, UpdateHabitInput } from "./types";

export interface ToggleHabitResult {
  habit: Habit;
  completed: boolean;
}

/**
 * Boundary the UI depends on for everything habit-related. Backed today by
 * a local adapter (see data/local-habit-repository.ts); swap the
 * implementation for a real API client later without touching a component.
 */
export interface HabitRepository {
  listAll(): Promise<Habit[]>;
  listScheduledForDate(dateKey: string): Promise<Habit[]>;
  create(input: CreateHabitInput): Promise<Habit>;
  update(id: string, input: UpdateHabitInput): Promise<Habit>;
  pause(id: string): Promise<Habit>;
  reactivate(id: string): Promise<Habit>;
  delete(id: string): Promise<void>;
  toggleForDate(id: string, dateKey: string): Promise<ToggleHabitResult>;
  isCompletedOnDate(id: string, dateKey: string): Promise<boolean>;
  listEntriesForUserBetween(startDateKey: string, endDateKey: string): Promise<HabitEntry[]>;
}
