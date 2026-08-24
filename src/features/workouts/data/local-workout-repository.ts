import type { KeyValueStorage } from "@/lib/storage/kv-storage";
import { createCollectionStorage } from "@/lib/storage/collection-storage";
import { createId } from "@/lib/id";
import type {
  WorkoutRepository,
  WorkoutTemplateExerciseInput,
  WorkoutTemplateInput,
  WorkoutTemplateWithExercises,
} from "../domain/workout-repository";
import type { WorkoutTemplate, WorkoutTemplateExercise } from "../domain/types";

const TEMPLATES_KEY = "trilu.workout-templates.v1";
const TEMPLATE_EXERCISES_KEY = "trilu.workout-template-exercises.v1";

export interface LocalWorkoutRepositoryDeps {
  kv: KeyValueStorage;
  getUserId: () => string;
  /** Looked up in the session repository's storage — kept as an injected query to avoid the two repositories reaching into each other's collections directly. */
  getLastExecutionDateKey: (templateId: string) => Promise<string | null>;
}

export function createLocalWorkoutRepository({
  kv,
  getUserId,
  getLastExecutionDateKey,
}: LocalWorkoutRepositoryDeps): WorkoutRepository {
  const templates = createCollectionStorage<WorkoutTemplate>(kv, TEMPLATES_KEY);
  const templateExercises = createCollectionStorage<WorkoutTemplateExercise>(kv, TEMPLATE_EXERCISES_KEY);

  function requireTemplate(id: string): WorkoutTemplate {
    const template = templates.getAll().find((t) => t.id === id && t.userId === getUserId() && !t.archivedAt);
    if (!template) throw new Error("Treino não encontrado.");
    return template;
  }

  function exercisesFor(templateId: string): WorkoutTemplateExercise[] {
    return templateExercises
      .getAll()
      .filter((e) => e.workoutTemplateId === templateId)
      .sort((a, b) => a.position - b.position);
  }

  function withExercises(template: WorkoutTemplate): WorkoutTemplateWithExercises {
    return { template, exercises: exercisesFor(template.id) };
  }

  function replaceExercises(templateId: string, inputs: WorkoutTemplateExerciseInput[]): WorkoutTemplateExercise[] {
    const kept = templateExercises.getAll().filter((e) => e.workoutTemplateId !== templateId);
    const next = inputs.map((input, index) => ({
      id: createId("tplex"),
      workoutTemplateId: templateId,
      position: index,
      ...input,
    }));
    templateExercises.setAll([...kept, ...next]);
    return next;
  }

  return {
    async listAll() {
      const userId = getUserId();
      return templates.getAll().filter((t) => t.userId === userId && !t.archivedAt);
    },

    async search(query) {
      const userId = getUserId();
      const normalized = query.trim().toLowerCase();
      const all = templates.getAll().filter((t) => t.userId === userId && !t.archivedAt);
      if (!normalized) return all;
      return all.filter((t) => t.name.toLowerCase().includes(normalized));
    },

    async getById(id) {
      const template = templates.getAll().find((t) => t.id === id && t.userId === getUserId());
      if (!template) return null;
      return withExercises(template);
    },

    async create(input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]) {
      const userId = getUserId();
      const now = new Date().toISOString();
      const template: WorkoutTemplate = {
        id: createId("workout"),
        userId,
        name: input.name,
        description: input.description,
        muscleGroups: input.muscleGroups,
        estimatedDurationMinutes: estimateDurationMinutes(exercises),
        createdAt: now,
        updatedAt: now,
        archivedAt: null,
      };
      templates.setAll([...templates.getAll(), template]);
      const savedExercises = replaceExercises(template.id, exercises);
      return { template, exercises: savedExercises };
    },

    async update(id, input: WorkoutTemplateInput, exercises: WorkoutTemplateExerciseInput[]) {
      const existing = requireTemplate(id);
      const updated: WorkoutTemplate = {
        ...existing,
        name: input.name,
        description: input.description,
        muscleGroups: input.muscleGroups,
        estimatedDurationMinutes: estimateDurationMinutes(exercises),
        updatedAt: new Date().toISOString(),
      };
      // Historical sessions keep their own exerciseNameSnapshot/setLogs —
      // replacing the template's exercise list here never touches them.
      templates.setAll(templates.getAll().map((t) => (t.id === id ? updated : t)));
      const savedExercises = replaceExercises(id, exercises);
      return { template: updated, exercises: savedExercises };
    },

    async rename(id, name) {
      const existing = requireTemplate(id);
      const updated: WorkoutTemplate = { ...existing, name, updatedAt: new Date().toISOString() };
      templates.setAll(templates.getAll().map((t) => (t.id === id ? updated : t)));
      return updated;
    },

    async duplicate(id) {
      const { template, exercises } = withExercises(requireTemplate(id));
      const now = new Date().toISOString();
      const copy: WorkoutTemplate = {
        ...template,
        id: createId("workout"),
        name: `${template.name} (cópia)`,
        createdAt: now,
        updatedAt: now,
      };
      templates.setAll([...templates.getAll(), copy]);
      const copiedExercises = replaceExercises(
        copy.id,
        exercises.map((e) => ({
          exerciseSource: e.exerciseSource,
          providerExerciseId: e.providerExerciseId,
          customExerciseId: e.customExerciseId,
          exerciseNameSnapshot: e.exerciseNameSnapshot,
          defaultSets: e.defaultSets,
          targetRepMin: e.targetRepMin,
          targetRepMax: e.targetRepMax,
          defaultRestSeconds: e.defaultRestSeconds,
          notes: e.notes,
        })),
      );
      return { template: copy, exercises: copiedExercises };
    },

    async archive(id) {
      const existing = requireTemplate(id);
      const updated: WorkoutTemplate = { ...existing, archivedAt: new Date().toISOString() };
      templates.setAll(templates.getAll().map((t) => (t.id === id ? updated : t)));
    },

    async getLastExecutionDateKey(id) {
      return getLastExecutionDateKey(id);
    },
  };
}

function estimateDurationMinutes(exercises: WorkoutTemplateExerciseInput[]): number {
  const SECONDS_PER_SET_WORK = 40;
  const totalSeconds = exercises.reduce((sum, ex) => {
    const restPerSet = ex.defaultRestSeconds;
    return sum + ex.defaultSets * (SECONDS_PER_SET_WORK + restPerSet);
  }, 0);
  return Math.max(1, Math.round(totalSeconds / 60));
}
