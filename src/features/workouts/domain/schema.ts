import { z } from "zod";
import { parseDecimalInput } from "@/lib/parse-decimal";
import {
  WORKOUT_NAME_MAX_LENGTH,
  WORKOUT_NAME_MIN_LENGTH,
  WORKOUT_EXERCISE_SET_COUNT_MIN,
  WORKOUT_EXERCISE_SET_COUNT_MAX,
  TARGET_WEIGHT_KG_MIN,
  TARGET_WEIGHT_KG_MAX,
  TARGET_REPETITIONS_MIN,
  TARGET_REPETITIONS_MAX,
} from "./types";

/** Creating a workout only asks for a name — exercises and their sets are added afterward, on the workout's own page. */
export const createWorkoutSchema = z.object({
  name: z
    .string()
    .trim()
    .min(WORKOUT_NAME_MIN_LENGTH, "Dê um nome para o treino.")
    .max(WORKOUT_NAME_MAX_LENGTH, `Use no máximo ${WORKOUT_NAME_MAX_LENGTH} caracteres.`),
});

export type CreateWorkoutFormInput = z.input<typeof createWorkoutSchema>;
export type CreateWorkoutFormValues = z.output<typeof createWorkoutSchema>;

export const WEIGHT_KG_MIN = 0;
export const WEIGHT_KG_MAX = 500;

export const setLogFormSchema = z.object({
  weightKg: z
    .string()
    .trim()
    .min(1, "Informe o peso.")
    .transform((raw, ctx) => {
      const value = parseDecimalInput(raw);
      if (value === null) {
        ctx.addIssue({ code: "custom", message: "Informe um peso válido." });
        return z.NEVER;
      }
      return value;
    })
    .pipe(
      z
        .number()
        .min(WEIGHT_KG_MIN, `Peso mínimo: ${WEIGHT_KG_MIN} kg.`)
        .max(WEIGHT_KG_MAX, `Peso máximo: ${WEIGHT_KG_MAX} kg.`)
        .multipleOf(0.1, "Use no máximo uma casa decimal."),
    ),
  repetitions: z.coerce
    .number({ message: "Informe as repetições." })
    .int("Use um número inteiro de repetições.")
    .min(0, "As repetições não podem ser negativas."),
  isWarmup: z.boolean().default(false),
});

export type SetLogFormInput = z.input<typeof setLogFormSchema>;
export type SetLogFormValues = z.output<typeof setLogFormSchema>;

/** A set can only be marked "done" with at least one repetition. */
export function canCompleteSet(repetitions: number): boolean {
  return repetitions >= 1;
}

/** One planned/target set inside the inline exercise editor — weight is optional (bodyweight exercises), reps are required. */
export const workoutExerciseSetSchema = z.object({
  targetWeightKg: z
    .string()
    .trim()
    .transform((raw, ctx) => {
      if (raw.length === 0) return null;
      const value = parseDecimalInput(raw);
      if (value === null) {
        ctx.addIssue({ code: "custom", message: "Informe um peso válido." });
        return z.NEVER;
      }
      if (value < TARGET_WEIGHT_KG_MIN || value > TARGET_WEIGHT_KG_MAX) {
        ctx.addIssue({ code: "custom", message: `Use um peso entre ${TARGET_WEIGHT_KG_MIN} e ${TARGET_WEIGHT_KG_MAX} kg.` });
        return z.NEVER;
      }
      return Math.round(value * 100) / 100;
    }),
  targetRepetitions: z.coerce
    .number({ message: "Informe as repetições." })
    .int("Use um número inteiro de repetições.")
    .min(TARGET_REPETITIONS_MIN, `Mínimo de ${TARGET_REPETITIONS_MIN} repetição.`)
    .max(TARGET_REPETITIONS_MAX, `Máximo de ${TARGET_REPETITIONS_MAX} repetições.`),
});

export type WorkoutExerciseSetFormInput = z.input<typeof workoutExerciseSetSchema>;
export type WorkoutExerciseSetFormValues = z.output<typeof workoutExerciseSetSchema>;

export const workoutExerciseSetCountSchema = z.coerce
  .number()
  .int("Use um número inteiro de séries.")
  .min(WORKOUT_EXERCISE_SET_COUNT_MIN, `Pelo menos ${WORKOUT_EXERCISE_SET_COUNT_MIN} série.`)
  .max(WORKOUT_EXERCISE_SET_COUNT_MAX, `No máximo ${WORKOUT_EXERCISE_SET_COUNT_MAX} séries.`);
