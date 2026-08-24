import { forwardRef, type ComponentProps } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SuffixedInputProps extends ComponentProps<"input"> {
  suffix: string;
}

/** Numeric input with a trailing unit label (kg, cm, anos). */
export const SuffixedInput = forwardRef<HTMLInputElement, SuffixedInputProps>(
  ({ suffix, className, ...props }, ref) => (
    <div className="relative">
      <Input ref={ref} className={cn("pr-14 text-lg font-bold", className)} {...props} />
      <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-base font-semibold text-ink-500">
        {suffix}
      </span>
    </div>
  ),
);
SuffixedInput.displayName = "SuffixedInput";
