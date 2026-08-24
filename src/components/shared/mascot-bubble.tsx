import { Mascot } from "./mascot";
import { cn } from "@/lib/utils";

interface MascotBubbleProps {
  message: string;
  size?: number;
  className?: string;
}

/**
 * Tilu speaking a short line of encouragement. Ports design-bundle's
 * MascotBubble component (mascot + speech card) to Tailwind classes.
 */
export function MascotBubble({ message, size = 56, className }: MascotBubbleProps) {
  return (
    <div className={cn("flex items-end gap-3 motion-safe:animate-[trilu-rise_var(--dur-slow)_var(--ease-standard)]", className)}>
      <Mascot size={size} className="shrink-0" />
      <div className="max-w-[280px] rounded-xl bg-card px-4 py-3 font-display text-sm font-semibold leading-snug text-ink-900 shadow-[var(--shadow-card)]">
        {message}
      </div>
    </div>
  );
}
