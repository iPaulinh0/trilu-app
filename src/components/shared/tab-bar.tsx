"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RouteIcon, DumbbellIcon, UsersIcon, UserIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const TABS: TabItem[] = [
  { href: "/trilha", label: "Trilha", icon: RouteIcon },
  { href: "/treino", label: "Treino", icon: DumbbellIcon },
  { href: "/amigos", label: "Amigos", icon: UsersIcon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

export function TabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegação principal"
      className="flex justify-around border-t border-ink-100 bg-card pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
    >
      {TABS.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            aria-current={isActive ? "page" : undefined}
            className="flex min-h-11 min-w-11 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg py-1 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-violet-400/40"
          >
            <Icon
              className={cn("size-6", isActive ? "text-violet-600" : "text-ink-400")}
              strokeWidth={isActive ? 2.5 : 2}
              aria-hidden
            />
            <span className={isActive ? "text-violet-600" : "text-ink-400"}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
