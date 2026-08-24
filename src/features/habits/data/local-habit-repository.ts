import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createId } from "@/lib/id";
import { getWeekdayFromDateKey } from "@/lib/date/local-date";
import type { TrailRepository } from "@/features/trail/domain/trail-repository";
import type { HabitRepository, ToggleHabitResult } from "../domain/habit-repository";
import { HabitLimitReachedError, HabitNotFoundError } from "../domain/errors";
import { MAX_ACTIVE_HABITS } from "../domain/types";
import type { CreateHabitInput, Habit, HabitEntry, UpdateHabitInput } from "../domain/types";

const HABITS_KEY = "trilu.habits.v1";
const ENTRIES_KEY = "trilu.habit-entries.v1";

export interface LocalHabitRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
  trailRepository: TrailRepository;
}

export function createLocalHabitRepository({ kv, getUserId, trailRepository }: LocalHabitRepositoryDeps): HabitRepository {
  const habits = createCollectionStorage<Habit>(kv, HABITS_KEY);
  const entries = createCollectionStorage<HabitEntry>(kv, ENTRIES_KEY);

  function requireHabit(id: string): Habit {
    const habit = habits.getAll().find((h) => h.id === id && h.userId === getUserId());
    if (!habit) throw new HabitNotFoundError();
    return habit;
  }

  function countActive(userId: string, excludeId?: string): number {
    return habits.getAll().filter((h) => h.userId === userId && h.isActive && h.id !== excludeId).length;
  }

  function findEntry(userId: string, habitId: string, dateKey: string): HabitEntry | null {
    return entries.getAll().find((e) => e.userId === userId && e.habitId === habitId && e.dateKey === dateKey) ?? null;
  }

  return {
    async listAll() {
      const userId = getUserId();
      return habits.getAll().filter((h) => h.userId === userId);
    },

    async listScheduledForDate(dateKey) {
      const userId = getUserId();
      const weekday = getWeekdayFromDateKey(dateKey);
      return habits
        .getAll()
        .filter((h) => h.userId === userId && h.isActive && h.scheduledWeekdays.includes(weekday));
    },

    async create(input: CreateHabitInput) {
      const userId = getUserId();
      if (countActive(userId) >= MAX_ACTIVE_HABITS) throw new HabitLimitReachedError();
      const now = new Date().toISOString();
      const habit: Habit = {
        id: createId("habit"),
        userId,
        name: input.name,
        description: input.description,
        icon: input.icon,
        color: input.color,
        scheduledWeekdays: input.scheduledWeekdays,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      habits.setAll([...habits.getAll(), habit]);
      return habit;
    },

    async update(id, input: UpdateHabitInput) {
      const existing = requireHabit(id);
      // Only mutable fields change — HabitEntry rows are a separate
      // collection, so editing a habit never touches its history.
      const updated: Habit = { ...existing, ...input, updatedAt: new Date().toISOString() };
      habits.setAll(habits.getAll().map((h) => (h.id === id ? updated : h)));
      return updated;
    },

    async pause(id) {
      const existing = requireHabit(id);
      const updated: Habit = { ...existing, isActive: false, updatedAt: new Date().toISOString() };
      habits.setAll(habits.getAll().map((h) => (h.id === id ? updated : h)));
      return updated;
    },

    async reactivate(id) {
      const existing = requireHabit(id);
      if (!existing.isActive && countActive(existing.userId, id) >= MAX_ACTIVE_HABITS) {
        throw new HabitLimitReachedError();
      }
      const updated: Habit = { ...existing, isActive: true, updatedAt: new Date().toISOString() };
      habits.setAll(habits.getAll().map((h) => (h.id === id ? updated : h)));
      return updated;
    },

    async delete(id) {
      requireHabit(id);
      // Entries/contributions are intentionally left untouched: steps
      // already earned are never retroactively revoked by deleting the
      // habit definition that produced them.
      habits.setAll(habits.getAll().filter((h) => h.id !== id));
    },

    async isCompletedOnDate(id, dateKey) {
      return findEntry(getUserId(), id, dateKey) !== null;
    },

    async toggleForDate(id, dateKey): Promise<ToggleHabitResult> {
      const userId = getUserId();
      const habit = requireHabit(id);
      const goal = await trailRepository.getOrCreateDefaultGoal();
      const existingEntry = findEntry(userId, id, dateKey);

      if (existingEntry) {
        // Trail side first: if it throws, the entry is left untouched and
        // the habit stays "completed" — no orphaned state either way.
        await trailRepository.revertContribution({
          goalId: goal.id,
          sourceType: "habit",
          sourceId: id,
          dateKey,
        });
        entries.setAll(entries.getAll().filter((e) => e.id !== existingEntry.id));
        return { habit, completed: false };
      }

      await trailRepository.addContribution({
        goalId: goal.id,
        sourceType: "habit",
        sourceId: id,
        dateKey,
        amount: 1,
      });
      const now = new Date().toISOString();
      const entry: HabitEntry = {
        id: createId("entry"),
        habitId: id,
        userId,
        dateKey,
        completedAt: now,
        createdAt: now,
        updatedAt: now,
      };
      entries.setAll([...entries.getAll(), entry]);
      return { habit, completed: true };
    },

    async listEntriesForUserBetween(startDateKey, endDateKey) {
      const userId = getUserId();
      return entries
        .getAll()
        .filter((e) => e.userId === userId && e.dateKey >= startDateKey && e.dateKey <= endDateKey);
    },
  };
}
