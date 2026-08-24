"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { resetPasswordSchema, type ResetPasswordFormValues } from "../domain/schema";
import { AuthError } from "../domain/types";
import { authService, resolvePostAuthPath } from "@/lib/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { Mascot } from "@/components/shared/mascot";
import { Logo } from "@/components/shared/logo";

type SessionStatus = "checking" | "valid" | "invalid";

export function ResetPasswordForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("checking");

  useEffect(() => {
    // /auth/callback already exchanged the recovery code for a session
    // before redirecting here — if there isn't one, the link was invalid,
    // already used, or expired.
    authService.getAuthenticatedUser().then((user) => {
      setSessionStatus(user ? "valid" : "invalid");
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: ResetPasswordFormValues) => {
    try {
      await authService.updatePassword(values.password);
      toast.success("Senha redefinida com sucesso!");
      router.push(await resolvePostAuthPath());
    } catch (error) {
      toast.error(error instanceof AuthError ? error.message : "Não foi possível redefinir sua senha agora.");
    }
  };

  if (sessionStatus === "checking") return null;

  if (sessionStatus === "invalid") {
    return (
      <div className="flex flex-1 flex-col">
        <div className="pt-1">
          <Logo height={28} />
        </div>
        <div className="mt-10 flex flex-1 flex-col items-center gap-4 text-center">
          <Mascot size={110} />
          <h1 className="text-2xl font-bold text-ink-900">Link inválido ou expirado</h1>
          <p className="max-w-xs text-sm leading-relaxed text-ink-500">
            Solicite um novo link de recuperação para continuar.
          </p>
          <Button
            type="button"
            variant="accent"
            size="lg"
            block
            onClick={() => router.push("/esqueci-senha")}
            className="mt-2"
          >
            Solicitar novo link
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
        <h1 className="text-2xl font-bold text-ink-900">Crie uma nova senha</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Nova senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-12"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              disabled={isSubmitting}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-500 hover:text-ink-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 rounded-md"
            >
              {showPassword ? <EyeOffIcon className="size-5" /> : <EyeIcon className="size-5" />}
            </button>
          </div>
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
            aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
            disabled={isSubmitting}
            {...register("confirmPassword")}
          />
          <FieldError id="confirmPassword-error" message={errors.confirmPassword?.message} />
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting} className="mt-2">
          Redefinir senha
        </Button>
      </form>
    </div>
  );
}
