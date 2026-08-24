import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Informe seu e-mail.")
    .email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome."),
    email: z
      .string()
      .trim()
      .min(1, "Informe seu e-mail.")
      .email("Informe um e-mail válido."),
    password: z.string().min(6, "A senha precisa ter pelo menos 6 caracteres."),
    confirmPassword: z.string().min(1, "Confirme sua senha."),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.acceptTerms === true, {
    message: "É necessário aceitar os termos para continuar.",
    path: ["acceptTerms"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
