import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-body font-bold whitespace-nowrap transition-[transform,box-shadow,filter] duration-150 ease-[var(--ease-standard)] outline-none select-none active:scale-[var(--press-scale)] disabled:pointer-events-none disabled:opacity-45 focus-visible:ring-[3px] focus-visible:ring-violet-400/40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "border-none bg-violet-500 text-white shadow-[var(--shadow-brand)] hover:shadow-[var(--shadow-raised)]",
        accent: "border-none bg-coral-500 text-white shadow-[var(--shadow-coral)] hover:shadow-[var(--shadow-raised)]",
        success: "border-none bg-mint-500 text-white shadow-[0_8px_20px_rgba(53,201,154,0.28)] hover:shadow-[var(--shadow-raised)]",
        secondary: "border-none bg-violet-50 text-violet-600 hover:bg-violet-100",
        outline: "border-2 border-ink-200 bg-transparent text-ink-900 hover:bg-ink-50",
        ghost: "border-none bg-transparent text-violet-600 hover:bg-violet-50",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-base",
        lg: "h-14 px-7 text-lg",
      },
      block: {
        true: "flex w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Button({
  className,
  variant,
  size,
  block,
  asChild = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, block, className }))}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Loader2Icon className="size-4 animate-spin" aria-hidden /> : null}
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
