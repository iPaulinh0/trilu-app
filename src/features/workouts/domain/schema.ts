import { z } from "zod";
import { TRILU_MUSCLE_GROUPS } from "@/features/exercises/domain/types";
import { parseDecimalInput } from "@/lib/parse-decimal";
import { WORKOUT_NAME_MAX_LENGTH, WORKOUT_NAME_MIN_LENGTH } from "./types";

export const workoutTemplateFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(WORKOUT_NAME_MIN_LENGTH, `Use pelo menos ${WORKOUT_NAME_MIN_LENGTH} caracteres.`)
    .max(WORKOUT_NAME_MAX_LENGTH, `Use no máximo ${WORKOUT_NAME_MAX_LENGTH} caracteres.`),
  description: z
    .string()
    .trim()
    .max(120, "Use no máximo 120 caracteres.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  muscleGroups: z.array(z.enum(TRILU_MUSCLE_GROUPS)).min(1, "Escolha pelo menos um grupo muscular."),
});

export type WorkoutTemplateFormInput = z.input<typeof workoutTemplateFormSchema>;
export type WorkoutTemplateFormValues = z.output<typeof workoutTemplateFormSchema>;

export const exerciseConfigSchema = z.object({
  defaultSets: z.coerce.number().int().min(1, "Pelo menos 1 série.").max(20, "No máximo 20 séries."),
  targetRepMin: z.coerce.number().int().min(1, "Mínimo de 1 repetição.").max(100),
  targetRepMax: z.coerce.number().int().min(1).max(100),
  defaultRestSeconds: z.coerce.number().int().min(0).max(600),
  notes: z
    .string()
    .trim()
    .max(140, "Use no máximo 140 caracteres.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
});

export type ExerciseConfigFormInput = z.input<typeof exerciseConfigSchema>;
export type ExerciseConfigValues = z.output<typeof exerciseConfigSchema>;

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
