/** Pure domain types for trail progress. No React, no DOM, no Next.js. */

export type ContributionSourceType = "habit" | "workout" | "nutrition" | "hydration";

export interface TrailGoal {
  id: string;
  userId: string;
  title: string;
  currentSteps: number;
  targetSteps: number;
  /** Ascending step thresholds along the trail, e.g. [5, 10, 15, 20, 25, 30]. */
  milestones: number[];
  createdAt: string;
  completedAt: string | null;
}

/**
 * One idempotent unit of progress. The logical key
 * `userId + goalId + sourceType + sourceId + dateKey` is unique — a second
 * contribution for the same key must never add steps twice.
 */
export interface TrailContribution {
  id: string;
  userId: string;
  goalId: string;
  sourceType: ContributionSourceType;
  sourceId: string;
  dateKey: string;
  amount: number;
  createdAt: string;
}

export const DEFAULT_TARGET_STEPS = 30;
export const DEFAULT_MILESTONES = [5, 10, 15, 20, 25, 30];
export const DEFAULT_TRAIL_TITLE = "Minha trilha";
