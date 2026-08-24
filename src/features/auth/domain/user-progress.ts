/** Pure domain type. Tracks whether a user finished the first-run habit setup. */
export interface UserProgress {
  userId: string;
  habitSetupCompleted: boolean;
}

export function createDefaultUserProgress(userId: string): UserProgress {
  return { userId, habitSetupCompleted: false };
}
