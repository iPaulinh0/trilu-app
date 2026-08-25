"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService, pendingEmailStorage, resolvePostAuthPath, userProfileStorage } from "@/lib/services";
import { AuthError } from "../domain/types";
import { OTP_LENGTH } from "../domain/schema";
import { useOnboardingDraft } from "@/features/onboarding/hooks/use-onboarding-draft";
import { OtpInput } from "./otp-input";
import { Button } from "@/components/ui/button";
import { Mascot } from "@/components/shared/mascot";
import { Logo } from "@/components/shared/logo";

const RESEND_COOLDOWN_SECONDS = 60;

/** "pa**o@exemplo.com" — never the full address, per the spec's masking requirement. */
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return `${local[0] ?? "*"}*@${domain}`;
  return `${local.slice(0, 2)}${"*".repeat(Math.max(local.length - 2, 1))}@${domain}`;
}

export function ConfirmEmailForm() {
  const router = useRouter();
  const { draft, resetDraft } = useOnboardingDraft();
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    const pending = pendingEmailStorage.load();
    if (!pending) {
      router.replace("/cadastro");
      return;
    }
    // One-time read from sessionStorage (an external system) on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEmail(pending);
  }, [router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  if (!email) return null;

  async function handleVerify() {
    if (!email || code.length !== OTP_LENGTH || isVerifying) return;
    setIsVerifying(true);
    setError(null);
    try {
      await authService.verifyEmailCode({ email, code });

      // Now that a session exists, hand the onboarding answers collected
      // before signup off to the (now real) account, then clear both drafts.
      const user = await authService.getAuthenticatedUser();
      if (user) {
        const { currentStep, updatedAt, ...onboardingAnswers } = draft;
        void currentStep;
        void updatedAt;
        userProfileStorage.save({ user, onboarding: onboardingAnswers, createdAt: new Date().toISOString() });
      }
      resetDraft();
      pendingEmailStorage.clear();

      toast.success("E-mail confirmado! Sua conta está pronta.");
      router.push(await resolvePostAuthPath());
    } catch (err) {
      setIsVerifying(false);
      setError(err instanceof AuthError ? err.message : "Não foi possível confirmar agora. Tente novamente.");
    }
  }

  async function handleResend() {
    if (!email || cooldown > 0 || isResending) return;
    setIsResending(true);
    try {
      await authService.resendEmailCode(email);
      toast.success("Enviamos um novo código.");
      setCooldown(RESEND_COOLDOWN_SECONDS);
    } catch (err) {
      toast.error(err instanceof AuthError ? err.message : "Não foi possível reenviar agora.");
    } finally {
      setIsResending(false);
    }
  }

  function handleChangeEmail() {
    pendingEmailStorage.clear();
    router.push("/cadastro");
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="pt-1">
        <Logo height={28} />
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <Mascot size={96} />
        <h1 className="text-2xl font-bold text-ink-900">Confirme seu e-mail</h1>
        <p className="text-sm text-ink-500">
          Enviamos um código de 6 dígitos para <span className="font-bold text-ink-700">{maskEmail(email)}</span>.
        </p>
        <p className="text-xs text-ink-400">Não encontrou o e-mail? Confira também sua caixa de spam ou lixo eletrônico.</p>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <OtpInput
          value={code}
          onChange={(value) => {
            setCode(value);
            setError(null);
          }}
          disabled={isVerifying}
          error={!!error}
        />
        <p role="alert" aria-live="polite" className="min-h-5 text-center text-sm font-semibold text-[var(--status-danger)]">
          {error}
        </p>

        <Button
          type="button"
          variant="accent"
          size="lg"
          block
          loading={isVerifying}
          disabled={code.length !== OTP_LENGTH}
          onClick={handleVerify}
        >
          Confirmar e-mail
        </Button>

        <div className="flex flex-col items-center gap-2 pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || isResending}
            className="text-sm font-bold text-violet-600 hover:underline disabled:cursor-not-allowed disabled:text-ink-400 disabled:no-underline"
          >
            {isResending ? "Reenviando..." : cooldown > 0 ? `Reenviar código em ${cooldown}s` : "Reenviar código"}
          </button>
          <button type="button" onClick={handleChangeEmail} className="text-sm text-ink-500 hover:underline">
            Errou o e-mail? Corrigir
          </button>
        </div>
      </div>
    </div>
  );
}
