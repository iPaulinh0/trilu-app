"use client";

import { BellIcon } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HomeHeaderProps {
  firstName: string;
  avatarUrl: string | null;
  nextMilestoneMessage: string;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function HomeHeader({ firstName, avatarUrl, nextMilestoneMessage }: HomeHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-bold text-ink-900">Olá, {firstName}!</h1>
        <p className="truncate text-sm text-ink-500">{nextMilestoneMessage}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          aria-label="Notificações"
          onClick={() => toast.info("Sem novidades por enquanto.")}
          className="flex size-11 items-center justify-center rounded-full text-ink-500 hover:bg-ink-50 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
        >
          <BellIcon className="size-5" aria-hidden />
        </button>
        <Avatar className="size-11">
          {avatarUrl ? <AvatarImage src={avatarUrl} alt={`Foto de perfil de ${firstName}`} /> : null}
          <AvatarFallback className="bg-violet-500 font-display text-base font-bold text-white" aria-hidden>
            {getInitial(firstName)}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
