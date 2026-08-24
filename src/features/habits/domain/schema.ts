import { z } from "zod";
import {
  HABIT_COLORS,
  HABIT_ICON_KEYS,
  HABIT_NAME_MAX_LENGTH,
  HABIT_NAME_MIN_LENGTH,
} from "./types";

export const habitFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(HABIT_NAME_MIN_LENGTH, `Use pelo menos ${HABIT_NAME_MIN_LENGTH} caracteres.`)
    .max(HABIT_NAME_MAX_LENGTH, `Use no máximo ${HABIT_NAME_MAX_LENGTH} caracteres.`),
  description: z
    .string()
    .trim()
    .max(80, "Use no máximo 80 caracteres.")
    .optional()
    .transform((value) => (value && value.length > 0 ? value : null)),
  icon: z.enum(HABIT_ICON_KEYS, { message: "Escolha um ícone." }),
  color: z.enum(HABIT_COLORS, { message: "Escolha uma cor." }),
  scheduledWeekdays: z
    .array(z.number().int().min(0).max(6))
    .min(1, "Selecione pelo menos um dia da semana."),
});

export type HabitFormInput = z.input<typeof habitFormSchema>;
export type HabitFormValues = z.output<typeof habitFormSchema>;
