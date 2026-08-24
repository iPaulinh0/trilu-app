import { z } from "zod";
import { TRILU_MUSCLE_GROUPS } from "./types";

export interface CustomExercise {
  id: string;
  userId: string;
  name: string;
  primaryMuscleGroup: (typeof TRILU_MUSCLE_GROUPS)[number];
  secondaryMuscleGroups: (typeof TRILU_MUSCLE_GROUPS)[number][];
  equipment: string | null;
  instructions: string | null;
  defaultRestSeconds: number | null;
  createdAt: string;
  updatedAt: string;
}

export const customExerciseFormSchema = z.object({
  name: z.string().trim().min(2, "Use pelo menos 2 caracteres.").max(60, "Use no máximo 60 caracteres."),
  primaryMuscleGroup: z.enum(TRILU_MUSCLE_GROUPS, { message: "Escolha um grupo muscular." }),
  secondaryMuscleGroups: z.array(z.enum(TRILU_MUSCLE_GROUPS)).default([]),
  equipment: z
    .string()
    .trim()
    .max(40, "Use no máximo 40 caracteres.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  instructions: z
    .string()
    .trim()
    .max(500, "Use no máximo 500 caracteres.")
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  defaultRestSeconds: z.coerce.number().int().min(0).max(600).optional().nullable(),
});

export type CustomExerciseFormInput = z.input<typeof customExerciseFormSchema>;
export type CustomExerciseFormValues = z.output<typeof customExerciseFormSchema>;
