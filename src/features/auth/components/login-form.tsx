"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { loginSchema, type LoginFormValues } from "../domain/schema";
import { AuthError } from "../domain/types";
import { authService, resolvePostAuthPath, authSessionStorage } from "@/lib/services";
import { invalidateCurrentUserCache } from "../hooks/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/shared/field-error";
import { Mascot } from "@/components/shared/mascot";
import { Logo } from "@/components/shared/logo";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const { user } = await authService.login(values);
      authSessionStorage.save(user);
      invalidateCurrentUserCache();
      toast.success("Login realizado com sucesso!");
      router.push(resolvePostAuthPath(user.id));
    } catch (error) {
      if (error instanceof AuthError) {
        toast.error(error.message);
      } else {
        toast.error("Serviço indisponível no momento. Tente novamente em instantes.");
      }
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-1">
        <Logo height={28} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <Mascot size={96} />
        <h1 className="text-2xl font-bold text-ink-900">Que bom ter você de volta!</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="voce@exemplo.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
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
              autoComplete="current-password"
              className="pr-12"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
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
          <button
            type="button"
            onClick={() => toast.info("Em breve você poderá recuperar sua senha por aqui.")}
            className="self-start text-sm font-bold text-violet-600 hover:underline"
          >
            Esqueci minha senha
          </button>
        </div>

        <Button type="submit" variant="accent" size="lg" block loading={isSubmitting} className="mt-2">
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-500">
        Ainda não tem conta?{" "}
        <button
          type="button"
          onClick={() => router.push("/onboarding")}
          className="font-bold text-violet-600 hover:underline"
        >
          Começar minha trilha
        </button>
      </p>
    </div>
  );
}
