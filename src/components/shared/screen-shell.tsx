import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScreenShellProps {
  children: ReactNode;
  className?: string;
}

/**
 * Mobile-first single column, centered with a max width on larger screens.
 * No fake phone frame — on a phone it fills the viewport and respects safe
 * areas; on desktop it just stays a comfortable reading column.
 */
export function ScreenShell({ children, className }: ScreenShellProps) {
  return (
    <div className="flex min-h-svh justify-center bg-background">
      <div
        className={cn(
          "flex w-full max-w-[430px] flex-1 flex-col px-5 pt-[max(1.25rem,env(safe-area-inset-top))]",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
