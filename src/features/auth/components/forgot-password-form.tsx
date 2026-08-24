"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "../domain/schema";
import { AuthError } from "../domain/types";
import { authService } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { Mascot } from "@/components/shared/mascot";
import { Logo } from "@/components/shared/logo";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      await authService.requestPasswordReset(values.email);
    } catch (error) {
      // Only a genuine failure (rate limit, network) surfaces as an error —
      // Supabase itself never reveals whether the email has an account.
      toast.error(error instanceof AuthError ? error.message : "Não foi possível enviar agora. Tente novamente.");
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="pt-1">
          <Logo height={28} />
        </div>
        <div className="mt-10 flex flex-1 flex-col items-center gap-4 text-center">
          <Mascot size={110} />
          <h1 className="text-2xl font-bold text-ink-900">Verifique seu e-mail</h1>
          <p className="max-w-xs text-sm leading-relaxed text-ink-500">
            Se esse e-mail tiver uma conta no TRILU, você vai receber um link para redefinir sua senha.
          </p>
          <Button type="button" variant="outline" size="lg" block onClick={() => router.push("/login")} className="mt-2">
            Voltar para o login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-1">
        <Logo height={28} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <Mascot size={96} />
        <h1 className="text-2xl font-bold text-ink-900">Esqueceu sua senha?</h1>
        <p className="max-w-xs text-sm leading-relaxed text-ink-500">
          Informe o e-mail da sua conta e enviaremos um link para você criar uma nova senha.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            disabled={isSubmitting}
            {...register("email")}
          />
          <FieldError id="email-error" message={errors.email?.message} />
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting} className="mt-2">
          Enviar link de recuperação
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        <button type="button" onClick={() => router.push("/login")} className="font-bold text-violet-600 hover:underline">
          Voltar para o login
        </button>
      </p>
    </div>
  );
}
