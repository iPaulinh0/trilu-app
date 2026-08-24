"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { RouteIcon, DumbbellIcon, UserIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TabItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/**
 * The four-tab "Amigos" nav was retired for this stage — kept to three.
 * The route and its page still exist (nothing was deleted), it's just no
 * longer linked from here.
 */
export const TABS: TabItem[] = [
  { href: "/trilha", label: "Trilha", icon: RouteIcon },
  { href: "/treinos", label: "Treinos", icon: DumbbellIcon },
  { href: "/perfil", label: "Perfil", icon: UserIcon },
];

/** Pure so it's testable without rendering: which tab (if any) matches a pathname. */
export function getActiveTabHref(pathname: string): string | null {
  const match = TABS.find((tab) => pathname === tab.href || pathname.startsWith(`${tab.href}/`));
  return match?.href ?? null;
}

/** Total height the fixed nav occupies, safe-area excluded — content padding must match this. */
export const TAB_BAR_HEIGHT_PX = 64;

export function TabBar() {
  const pathname = usePathname();
  const activeHref = getActiveTabHref(pathname);

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-100 bg-card/95 backdrop-blur-sm"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav
        aria-label="Navegação principal"
        className="mx-auto flex w-full max-w-[430px] justify-around"
        style={{ height: TAB_BAR_HEIGHT_PX }}
      >
        {TABS.map(({ href, label, icon: Icon }) => {
          const isActive = href === activeHref;
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
    </div>
  );
}
