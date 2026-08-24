import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;

/** Shared so the signup and reset-password screens enforce the exact same rule. */
export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `A senha precisa ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`)
  .regex(/[A-Za-z]/, "A senha precisa ter pelo menos uma letra.")
  .regex(/\d/, "A senha precisa ter pelo menos um número.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Informe seu e-mail.")
  .email("Informe um e-mail válido.")
  .transform((value) => value.toLowerCase());

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe sua senha."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z.string().trim().min(2, "Informe seu nome."),
    email: emailSchema,
    password: passwordSchema,
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

export const OTP_LENGTH = 6;

export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(OTP_LENGTH, `Informe os ${OTP_LENGTH} dígitos do código.`)
    .regex(/^\d+$/, "O código contém apenas números."),
});

export type OtpFormValues = z.infer<typeof otpSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Confirme sua senha."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
