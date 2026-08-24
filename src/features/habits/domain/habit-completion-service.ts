import type { HabitRepository, ToggleHabitResult } from "./habit-repository";

export interface ToggleHabitWithRollbackParams {
  habitRepository: HabitRepository;
  habitId: string;
  dateKey: string;
  wasCompleted: boolean;
  onOptimisticUpdate: (nextCompleted: boolean) => void;
  onSuccess: (result: ToggleHabitResult) => void;
  onRollback: (previousCompleted: boolean) => void;
}

/**
 * Centralizes the "flip now, confirm with the repository, revert on
 * failure" dance so no component has to hand-roll it around a checkbox.
 * Framework-free — takes plain callbacks, so it's testable without React.
 */
export async function toggleHabitWithRollback({
  habitRepository,
  habitId,
  dateKey,
  wasCompleted,
  onOptimisticUpdate,
  onSuccess,
  onRollback,
}: ToggleHabitWithRollbackParams): Promise<void> {
  const optimisticNext = !wasCompleted;
  onOptimisticUpdate(optimisticNext);
  try {
    const result = await habitRepository.toggleForDate(habitId, dateKey);
    onSuccess(result);
  } catch (error) {
    onRollback(wasCompleted);
    throw error;
  }
}
