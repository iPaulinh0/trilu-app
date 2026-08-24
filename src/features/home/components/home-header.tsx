"use client";

import { BellIcon } from "lucide-react";
import { toast } from "sonner";

interface HomeHeaderProps {
  firstName: string;
  nextMilestoneMessage: string;
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export function HomeHeader({ firstName, nextMilestoneMessage }: HomeHeaderProps) {
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
        <span
          aria-hidden
          className="flex size-11 items-center justify-center rounded-full bg-violet-500 font-display text-base font-bold text-white"
        >
          {getInitial(firstName)}
        </span>
      </div>
    </header>
  );
}
