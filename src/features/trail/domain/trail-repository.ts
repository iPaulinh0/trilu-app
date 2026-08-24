import type { ContributionSourceType, TrailContribution, TrailGoal } from "./types";

export interface AddContributionInput {
  goalId: string;
  sourceType: ContributionSourceType;
  sourceId: string;
  dateKey: string;
  amount: number;
}

export interface RevertContributionInput {
  goalId: string;
  sourceType: ContributionSourceType;
  sourceId: string;
  dateKey: string;
}

export interface AddContributionResult {
  goal: TrailGoal;
  contribution: TrailContribution;
}

/**
 * Boundary for trail progress. `addContribution` / `revertContribution` are
 * the only way `currentSteps` ever changes — never increment it by hand.
 */
export interface TrailRepository {
  getOrCreateDefaultGoal(): Promise<TrailGoal>;
  getProgress(goalId: string): Promise<TrailGoal>;
  addContribution(input: AddContributionInput): Promise<AddContributionResult>;
  revertContribution(input: RevertContributionInput): Promise<{ goal: TrailGoal }>;
  hasContribution(
    goalId: string,
    sourceType: ContributionSourceType,
    sourceId: string,
    dateKey: string,
  ): Promise<boolean>;
  listContributionsForGoal(goalId: string): Promise<TrailContribution[]>;
}
