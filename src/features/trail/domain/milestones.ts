import type { TrailContribution, TrailGoal } from "./types";

export interface NextMilestoneInfo {
  nextMilestone: number | null;
  stepsRemaining: number | null;
}

/** The next milestone strictly ahead of the current step count, if any. */
export function getNextMilestone(goal: TrailGoal): NextMilestoneInfo {
  const next = goal.milestones.find((milestone) => milestone > goal.currentSteps);
  if (next === undefined) return { nextMilestone: null, stepsRemaining: null };
  return { nextMilestone: next, stepsRemaining: next - goal.currentSteps };
}

export interface Achievement {
  title: string;
  dateKey: string;
}

/**
 * Replays contributions in chronological order to find the most recent
 * milestone the user crossed, and the date that crossing happened.
 */
export function getLastAchievement(
  goal: TrailGoal,
  contributions: TrailContribution[],
): Achievement | null {
  const sorted = [...contributions].sort((a, b) => a.dateKey.localeCompare(b.dateKey));
  let cumulative = 0;
  let last: Achievement | null = null;
  let milestoneIndex = 0;

  for (const contribution of sorted) {
    cumulative += contribution.amount;
    while (
      milestoneIndex < goal.milestones.length &&
      cumulative >= goal.milestones[milestoneIndex]
    ) {
      last = { title: `${goal.milestones[milestoneIndex]} passos de constância`, dateKey: contribution.dateKey };
      milestoneIndex += 1;
    }
  }

  return last;
}
