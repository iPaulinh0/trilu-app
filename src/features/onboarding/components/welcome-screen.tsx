"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/logo";
import { Mascot } from "@/components/shared/mascot";
import { BottomActionArea } from "@/components/shared/bottom-action-area";

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="pt-1">
        <Logo height={28} />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center motion-safe:animate-[trilu-rise_var(--dur-slow)_var(--ease-standard)]">
        <Mascot size={220} priority />
        <div className="flex flex-col gap-3">
          <h1 className="text-[32px] font-bold leading-tight text-ink-900">
            Seu objetivo vira caminho.
          </h1>
          <p className="text-base leading-relaxed text-ink-700">
            Oi, eu sou o Tilu. Vou te acompanhar em cada passo, no seu ritmo, sem cobrança.
          </p>
        </div>
      </div>

      <BottomActionArea>
        <Button variant="accent" size="lg" block onClick={() => router.push("/onboarding")}>
          Começar
        </Button>
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="min-h-11 text-sm font-bold text-ink-500 transition-colors hover:text-ink-700 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40 rounded-md"
        >
          Já tenho conta
        </button>
      </BottomActionArea>
    </div>
  );
}
