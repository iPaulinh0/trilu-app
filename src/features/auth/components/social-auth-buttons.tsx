"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react";
import { authService } from "@/lib/services";
import { AuthError } from "../domain/types";
import { GoogleIcon } from "./google-icon";

interface SocialAuthButtonsProps {
  /** True while the surrounding email/password form is submitting — blocks a second, conflicting action. */
  disabled?: boolean;
}

/** Google is currently the only social provider — see README for why Apple was dropped. */
export function SocialAuthButtons({ disabled = false }: SocialAuthButtonsProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleGoogle() {
    if (isLoading || disabled) return;
    setIsLoading(true);
    try {
      await authService.signInWithGoogle();
      // Success navigates the whole browser away to Google — nothing to reset.
    } catch (error) {
      setIsLoading(false);
      toast.error(error instanceof AuthError ? error.message : "Não foi possível continuar com o Google agora.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3" role="separator" aria-label="ou continue com">
        <div className="h-px flex-1 bg-ink-100" aria-hidden />
        <span className="text-xs font-semibold tracking-[0.04em] text-ink-400">ou continue com</span>
        <div className="h-px flex-1 bg-ink-100" aria-hidden />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={isLoading || disabled}
        aria-busy={isLoading || undefined}
        className="flex min-h-12 items-center justify-center gap-3 rounded-full border-2 border-ink-200 bg-card text-base font-bold text-ink-900 transition-colors hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading ? <Loader2Icon className="size-5 animate-spin" aria-hidden /> : <GoogleIcon className="size-5" />}
        Continuar com Google
      </button>
    </div>
  );
}
