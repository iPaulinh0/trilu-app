import type { SupabaseClient } from "@supabase/supabase-js";
import { WorkoutNotFoundError } from "../domain/errors";
import type {
  WorkoutRepository,
  WorkoutTemplateExerciseInput,
  WorkoutTemplateWithExercises,
} from "../domain/workout-repository";
import {
  mapWorkoutRow,
  mapExerciseRow,
  estimateDurationMinutes,
  buildBootstrapSets,
  type WorkoutRow,
  type WorkoutExerciseRow,
} from "./supabase-workout-mapper";

const EXERCISE_WITH_SETS_SELECT = "*, workout_exercise_sets(*)";
const WORKOUT_WITH_EXERCISES_SELECT = `*, workout_exercises(${EXERCISE_WITH_SETS_SELECT})`;
/** listAll() only needs enough of each exercise to estimate duration — never the full catalog snapshot or set values. */
const WORKOUT_WITH_EXERCISE_SUMMARY_SELECT = "*, workout_exercises(rest_seconds, workout_exercise_sets(id))";

export interface SupabaseWorkoutRepositoryDeps {
  supabase: SupabaseClient;
  /** Looked up in the (still local, for this stage) session repository's storage — an injected query, same pattern the previous local implementation used. */
  getLastExecutionDateKey: (templateId: string) => Promise<string | null>;
}

function exerciseInputToRpcJson(input: WorkoutTemplateExerciseInput) {
  return {
    exerciseSource: input.exerciseSource,
    providerExerciseId: input.providerExerciseId,
    customExerciseId: input.customExerciseId,
    exerciseNameSnapshot: input.exerciseNameSnapshot,
    muscleGroup: input.muscleGroup,
    equipment: input.equipment,
    mediaUrl: input.gifUrl,
    restSeconds: input.defaultRestSeconds,
    notes: input.notes,
    sets: buildBootstrapSets(input.defaultSets, input.targetRepMax),
  };
}

export function createSupabaseWorkoutRepository({
  supabase,
  getLastExecutionDateKey,
}: SupabaseWorkoutRepositoryDeps): WorkoutRepository {
  async function fetchById(id: string): Promise<WorkoutTemplateWithExercises | null> {
    const { data, error } = await supabase
      .from("workouts")
      .select(WORKOUT_WITH_EXERCISES_SELECT)
      .eq("id", id)
      .is("archived_at", null)
      .maybeSingle();
    if (error || !data) return null;
    const row = data as unknown as WorkoutRow & { workout_exercises: WorkoutExerciseRow[] };
    const exercises = [...row.workout_exercises].sort((a, b) => a.position - b.position).map(mapExerciseRow);
    const duration = estimateDurationMinutes(
      exercises.map((e) => ({ restSeconds: e.defaultRestSeconds, setCount: e.defaultSets })),
    );
    return { template: mapWorkoutRow(row, duration), exercises };
  }

  /** Always creates — the "replace an existing workout's exercise list" branch of the save_workout RPC is unused now that exercises are managed individually (addExercise/removeExercise/moveExercise), but the RPC itself is left as is to avoid another remote migration for a harmless, unused capability. */
  async function createWorkout(input: { name: string; description: string | null; muscleGroups: string[] }, exercisesJson: unknown[]) {
    const { data, error } = await supabase.rpc("save_workout", {
      p_workout_id: null,
      p_name: input.name,
      p_description: input.description,
      p_muscle_groups: input.muscleGroups,
      p_exercises: exercisesJson,
    });
    if (error || !data) throw new Error("Não foi possível criar o treino agora.");
    const saved = await fetchById(data as string);
    if (!saved) throw new WorkoutNotFoundError();
    return saved;
  }

  async function listAll() {
    const { data, error } = await supabase
      .from("workouts")
      .select(WORKOUT_WITH_EXERCISE_SUMMARY_SELECT)
      .is("archived_at", null)
      .order("created_at", { ascending: true });
    if (error) throw new Error("Não foi possível carregar seus treinos.");

    type SummaryRow = WorkoutRow & {
      workout_exercises: { rest_seconds: number; workout_exercise_sets: { id: string }[] }[];
    };
    return ((data ?? []) as unknown as SummaryRow[]).map((row) => {
      const duration = estimateDurationMinutes(
        row.workout_exercises.map((e) => ({ restSeconds: e.rest_seconds, setCount: e.workout_exercise_sets.length })),
      );
      return mapWorkoutRow(row, duration);
    });
  }

  return {
    listAll,

    async search(query) {
      const all = await listAll();
      const normalized = query.trim().toLowerCase();
      if (!normalized) return all;
      return all.filter((t) => t.name.toLowerCase().includes(normalized));
    },

    async getById(id) {
      return fetchById(id);
    },

    async create(input, exercises) {
      return createWorkout(input, exercises.map(exerciseInputToRpcJson));
    },

    async rename(id, name) {
      const { data, error } = await supabase
        .from("workouts")
        .update({ name, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .maybeSingle();
      if (error || !data) throw new WorkoutNotFoundError();
      const full = await fetchById(id);
      if (!full) throw new WorkoutNotFoundError();
      return full.template;
    },

    async duplicate(id) {
      const existing = await fetchById(id);
      if (!existing) throw new WorkoutNotFoundError();
      // Preserves each set's own weight/reps (not the bootstrap defaults) —
      // built directly from the existing sets rather than exerciseInputToRpcJson.
      const exercisesJson = existing.exercises.map((e) => ({
        exerciseSource: e.exerciseSource,
        providerExerciseId: e.providerExerciseId,
        customExerciseId: e.customExerciseId,
        exerciseNameSnapshot: e.exerciseNameSnapshot,
        muscleGroup: e.muscleGroup,
        equipment: e.equipment,
        mediaUrl: e.gifUrl,
        restSeconds: e.defaultRestSeconds,
        notes: e.notes,
        sets: e.sets.map((s) => ({ setNumber: s.setNumber, targetWeightKg: s.targetWeightKg, targetRepetitions: s.targetRepetitions })),
      }));
      return createWorkout(
        { name: `${existing.template.name} (cópia)`, description: existing.template.description, muscleGroups: existing.template.muscleGroups },
        exercisesJson,
      );
    },

    async archive(id) {
      const { error } = await supabase
        .from("workouts")
        .update({ archived_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw new WorkoutNotFoundError();
    },

    async getLastExecutionDateKey(id) {
      return getLastExecutionDateKey(id);
    },

    async addExercise(workoutId, input) {
      const { data, error } = await supabase.rpc("add_workout_exercise", {
        p_workout_id: workoutId,
        p_exercise_source: input.exerciseSource,
        p_provider_exercise_id: input.providerExerciseId,
        p_custom_exercise_id: input.customExerciseId,
        p_exercise_name_snapshot: input.exerciseNameSnapshot,
        p_muscle_group: input.muscleGroup,
        p_equipment: input.equipment,
        p_media_url: input.gifUrl,
        p_rest_seconds: input.defaultRestSeconds,
        p_notes: input.notes,
        p_sets: buildBootstrapSets(input.defaultSets, input.targetRepMax),
      });
      if (error || !data) throw new WorkoutNotFoundError();

      const { data: row, error: fetchError } = await supabase
        .from("workout_exercises")
        .select(EXERCISE_WITH_SETS_SELECT)
        .eq("id", data as string)
        .single();
      if (fetchError || !row) throw new Error("Não foi possível carregar o exercício adicionado.");
      return mapExerciseRow(row as unknown as WorkoutExerciseRow);
    },

    async removeExercise(workoutExerciseId) {
      const { error } = await supabase.from("workout_exercises").delete().eq("id", workoutExerciseId);
      if (error) throw new Error("Não foi possível remover esse exercício agora.");
    },

    async moveExercise(workoutId, exerciseId, direction) {
      const { data, error } = await supabase
        .from("workout_exercises")
        .select("id, position")
        .eq("workout_id", workoutId)
        .order("position", { ascending: true });
      if (error || !data) throw new Error("Não foi possível reordenar agora.");

      const rows = data as { id: string; position: number }[];
      const index = rows.findIndex((r) => r.id === exerciseId);
      const targetIndex = index + direction;
      if (index === -1 || targetIndex < 0 || targetIndex >= rows.length) return;

      const current = rows[index];
      const neighbor = rows[targetIndex];
      const now = new Date().toISOString();
      const [a, b] = await Promise.all([
        supabase.from("workout_exercises").update({ position: neighbor.position, updated_at: now }).eq("id", current.id),
        supabase.from("workout_exercises").update({ position: current.position, updated_at: now }).eq("id", neighbor.id),
      ]);
      if (a.error || b.error) throw new Error("Não foi possível reordenar agora.");
    },

    async updateExerciseConfiguration({ workoutExerciseId, restSeconds, sets }) {
      const { error } = await supabase.rpc("save_workout_exercise_configuration", {
        p_workout_exercise_id: workoutExerciseId,
        p_rest_seconds: restSeconds,
        p_sets: sets,
      });
      if (error) throw new Error("Não foi possível salvar a configuração agora.");

      const { data, error: fetchError } = await supabase
        .from("workout_exercises")
        .select(EXERCISE_WITH_SETS_SELECT)
        .eq("id", workoutExerciseId)
        .single();
      if (fetchError || !data) throw new Error("Não foi possível carregar a configuração salva.");
      return mapExerciseRow(data as unknown as WorkoutExerciseRow);
    },
  };
}
