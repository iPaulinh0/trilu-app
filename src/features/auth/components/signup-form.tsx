"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { CheckCircle2Icon, CircleIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { signupSchema, type SignupFormValues } from "../domain/schema";
import { AuthError } from "../domain/types";
import { authService, pendingEmailStorage } from "@/lib/services";
import { SocialAuthButtons } from "./social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldError } from "@/components/shared/field-error";
import { Mascot } from "@/components/shared/mascot";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

function PasswordRequirements({ password }: { password: string }) {
  const requirements = [
    { label: "Pelo menos 8 caracteres", met: password.length >= 8 },
    { label: "Pelo menos uma letra", met: /[A-Za-z]/.test(password) },
    { label: "Pelo menos um número", met: /\d/.test(password) },
  ];

  return (
    <ul className="flex flex-col gap-1" aria-label="Requisitos da senha">
      {requirements.map((req) => (
        <li
          key={req.label}
          className={cn("flex items-center gap-2 text-xs font-semibold", req.met ? "text-mint-600" : "text-ink-400")}
        >
          {req.met ? (
            <CheckCircle2Icon className="size-3.5 shrink-0" aria-hidden />
          ) : (
            <CircleIcon className="size-3.5 shrink-0" aria-hidden />
          )}
          {req.label}
        </li>
      ))}
    </ul>
  );
}

export function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "", acceptTerms: false },
  });

  const password = watch("password");

  const onSubmit = async (values: SignupFormValues) => {
    try {
      await authService.signUpWithEmail(values);
      pendingEmailStorage.save(values.email);
      toast.success("Enviamos um código de confirmação para o seu e-mail.");
      router.push("/confirmar-email");
    } catch (error) {
      toast.error(
        error instanceof AuthError
          ? error.message
          : "Serviço indisponível no momento. Tente novamente em instantes.",
      );
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-1">
        <Logo height={28} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <Mascot size={88} />
        <h1 className="text-2xl font-bold text-ink-900">Vamos criar sua conta</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4" noValidate>
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nome</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Como podemos te chamar?"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            disabled={isSubmitting}
            {...register("name")}
          />
          <FieldError id="name-error" message={errors.name?.message} />
        </div>

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

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className="pr-12"
              aria-invalid={!!errors.password}
              aria-describedby="password-requirements password-error"
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
          <div id="password-requirements">
            <PasswordRequirements password={password} />
          </div>
          <FieldError id="password-error" message={errors.password?.message} />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="confirmPassword">Confirmar senha</Label>
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

        <Controller
          control={control}
          name="acceptTerms"
          render={({ field }) => (
            <div className="flex flex-col gap-2 pt-1">
              <label className="flex items-start gap-3 text-sm text-ink-700">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(checked === true)}
                  aria-invalid={!!errors.acceptTerms}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                Li e aceito os termos de uso e a política de privacidade.
              </label>
              <FieldError message={errors.acceptTerms?.message} />
            </div>
          )}
        />

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting} className="mt-2">
          Criar minha conta
        </Button>
      </form>

      <div className="mt-6">
        <SocialAuthButtons disabled={isSubmitting} />
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        Já tenho uma conta?{" "}
        <button type="button" onClick={() => router.push("/login")} className="font-bold text-violet-600 hover:underline">
          Entrar
        </button>
      </p>
    </div>
  );
}
