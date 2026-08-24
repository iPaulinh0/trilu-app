import { z } from "zod";
import {
  AGE_MAX,
  AGE_MIN,
  HEIGHT_CM_MAX,
  HEIGHT_CM_MIN,
  WEIGHT_KG_MAX,
  WEIGHT_KG_MIN,
} from "./types";
import { parseDecimalInput } from "./number-input";

const GOAL_VALUES = [
  "voltarRotina",
  "ganharForca",
  "ganharMassa",
  "perderGordura",
  "melhorarCondicionamento",
  "competirComigoMesmo",
  "outro",
] as const;

export const goalStepSchema = z
  .object({
    goal: z.enum(GOAL_VALUES, { message: "Escolha um objetivo para continuar." }),
    customGoal: z.string().trim().max(60, "Use no máximo 60 caracteres.").optional(),
  })
  .refine(
    (data) => data.goal !== "outro" || (data.customGoal?.trim().length ?? 0) >= 2,
    {
      message: "Conte rapidamente qual é o seu objetivo.",
      path: ["customGoal"],
    },
  );

export type GoalStepInput = z.infer<typeof goalStepSchema>;

/** UI-level selection for the frequency step: a week count, or "não sei". */
export const frequencySelectionSchema = z.enum([
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "unknown",
], { message: "Escolha uma frequência para continuar." });

export type FrequencySelection = z.infer<typeof frequencySelectionSchema>;

export const ageStepSchema = z.object({
  age: z.coerce
    .number({ message: "Informe sua idade." })
    .int("Use um número inteiro de anos.")
    .min(AGE_MIN, `Idade mínima: ${AGE_MIN} anos.`)
    .max(AGE_MAX, `Idade máxima: ${AGE_MAX} anos.`),
});

export type AgeStepFormValues = z.input<typeof ageStepSchema>;
export type AgeStepInput = z.output<typeof ageStepSchema>;

export const weightStepSchema = z.object({
  weightKg: z
    .string()
    .trim()
    .min(1, "Informe seu peso.")
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
        .max(WEIGHT_KG_MAX, `Peso máximo: ${WEIGHT_KG_MAX} kg.`),
    ),
});

export type WeightStepInput = z.infer<typeof weightStepSchema>;

export const heightStepSchema = z.object({
  heightCm: z.coerce
    .number({ message: "Informe sua altura." })
    .int("Use um número inteiro de centímetros.")
    .min(HEIGHT_CM_MIN, `Altura mínima: ${HEIGHT_CM_MIN} cm.`)
    .max(HEIGHT_CM_MAX, `Altura máxima: ${HEIGHT_CM_MAX} cm.`),
});

export type HeightStepFormValues = z.input<typeof heightStepSchema>;
export type HeightStepInput = z.output<typeof heightStepSchema>;

export const sexForBmrStepSchema = z.object({
  sexForBmr: z.enum(["female", "male"], {
    message: "Escolha uma referência para continuar.",
  }),
});

export type SexForBmrStepInput = z.infer<typeof sexForBmrStepSchema>;

export const activityLevelStepSchema = z.object({
  activityLevel: z.enum(
    ["sedentary", "lightlyActive", "moderatelyActive", "veryActive", "extremelyActive"],
    { message: "Escolha um nível de atividade para continuar." },
  ),
});

export type ActivityLevelStepInput = z.infer<typeof activityLevelStepSchema>;
