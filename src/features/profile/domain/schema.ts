import { z } from "zod";

export const PROFILE_NAME_MIN_LENGTH = 2;
export const PROFILE_NAME_MAX_LENGTH = 60;

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(PROFILE_NAME_MIN_LENGTH, `Use pelo menos ${PROFILE_NAME_MIN_LENGTH} caracteres.`)
    .max(PROFILE_NAME_MAX_LENGTH, `Use no máximo ${PROFILE_NAME_MAX_LENGTH} caracteres.`),
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido.")
    .transform((value) => value.toLowerCase()),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
