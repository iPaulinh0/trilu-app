import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border-2 border-ink-200 bg-card px-4 py-1 text-base text-ink-900 transition-colors outline-none placeholder:text-ink-400 focus-visible:border-violet-400 focus-visible:ring-[3px] focus-visible:ring-violet-400/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-[var(--status-danger)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--status-danger)]/20",
        className
      )}
      {...props}
    />
  )
}

export { Input }
