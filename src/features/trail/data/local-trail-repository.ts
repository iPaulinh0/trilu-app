import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createId } from "@/lib/id";
import type {
  AddContributionInput,
  AddContributionResult,
  RevertContributionInput,
  TrailRepository,
} from "../domain/trail-repository";
import { DEFAULT_MILESTONES, DEFAULT_TARGET_STEPS, DEFAULT_TRAIL_TITLE } from "../domain/types";
import type { TrailContribution, TrailGoal } from "../domain/types";

const GOALS_KEY = "trilu.trail-goals.v1";
const CONTRIBUTIONS_KEY = "trilu.trail-contributions.v1";

export interface LocalTrailRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
  /** Lets the composition root name the goal after the user's onboarding objective. */
  getDefaultTitle?: () => string;
}

export function createLocalTrailRepository({ kv, getUserId, getDefaultTitle }: LocalTrailRepositoryDeps): TrailRepository {
  const goals = createCollectionStorage<TrailGoal>(kv, GOALS_KEY);
  const contributions = createCollectionStorage<TrailContribution>(kv, CONTRIBUTIONS_KEY);

  function findContribution(
    userId: string,
    goalId: string,
    sourceType: string,
    sourceId: string,
    dateKey: string,
  ): TrailContribution | null {
    return (
      contributions
        .getAll()
        .find(
          (c) =>
            c.userId === userId &&
            c.goalId === goalId &&
            c.sourceType === sourceType &&
            c.sourceId === sourceId &&
            c.dateKey === dateKey,
        ) ?? null
    );
  }

  function requireGoal(goalId: string): TrailGoal {
    const goal = goals.getAll().find((g) => g.id === goalId);
    if (!goal) throw new Error("Meta de trilha não encontrada.");
    return goal;
  }

  return {
    async getOrCreateDefaultGoal() {
      const userId = getUserId();
      const existing = goals.getAll().find((g) => g.userId === userId);
      if (existing) return existing;
      const created: TrailGoal = {
        id: createId("goal"),
        userId,
        title: getDefaultTitle?.() || DEFAULT_TRAIL_TITLE,
        currentSteps: 0,
        targetSteps: DEFAULT_TARGET_STEPS,
        milestones: DEFAULT_MILESTONES,
        createdAt: new Date().toISOString(),
        completedAt: null,
      };
      goals.setAll([...goals.getAll(), created]);
      return created;
    },

    async getProgress(goalId) {
      return requireGoal(goalId);
    },

    async addContribution(input: AddContributionInput): Promise<AddContributionResult> {
      const userId = getUserId();
      const existing = findContribution(userId, input.goalId, input.sourceType, input.sourceId, input.dateKey);
      const goal = requireGoal(input.goalId);
      if (existing) {
        // Idempotent: the same logical contribution already exists — never
        // add the steps twice.
        return { goal, contribution: existing };
      }
      const contribution: TrailContribution = {
        id: createId("contrib"),
        userId,
        goalId: input.goalId,
        sourceType: input.sourceType,
        sourceId: input.sourceId,
        dateKey: input.dateKey,
        amount: input.amount,
        createdAt: new Date().toISOString(),
      };
      contributions.setAll([...contributions.getAll(), contribution]);
      const updatedGoal: TrailGoal = {
        ...goal,
        currentSteps: goal.currentSteps + input.amount,
        completedAt:
          goal.completedAt ?? (goal.currentSteps + input.amount >= goal.targetSteps ? new Date().toISOString() : null),
      };
      goals.setAll(goals.getAll().map((g) => (g.id === goal.id ? updatedGoal : g)));
      return { goal: updatedGoal, contribution };
    },

    async revertContribution(input: RevertContributionInput) {
      const userId = getUserId();
      const existing = findContribution(userId, input.goalId, input.sourceType, input.sourceId, input.dateKey);
      const goal = requireGoal(input.goalId);
      if (!existing) {
        // Nothing to revert — idempotent no-op.
        return { goal };
      }
      contributions.setAll(contributions.getAll().filter((c) => c.id !== existing.id));
      const updatedGoal: TrailGoal = {
        ...goal,
        currentSteps: Math.max(0, goal.currentSteps - existing.amount),
        completedAt: goal.currentSteps - existing.amount < goal.targetSteps ? null : goal.completedAt,
      };
      goals.setAll(goals.getAll().map((g) => (g.id === goal.id ? updatedGoal : g)));
      return { goal: updatedGoal };
    },

    async hasContribution(goalId, sourceType, sourceId, dateKey) {
      return findContribution(getUserId(), goalId, sourceType, sourceId, dateKey) !== null;
    },

    async listContributionsForGoal(goalId) {
      const userId = getUserId();
      return contributions.getAll().filter((c) => c.userId === userId && c.goalId === goalId);
    },
  };
}
