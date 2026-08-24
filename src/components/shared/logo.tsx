import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  height?: number;
}

/** The Trilu wordmark. Always the real asset — never re-drawn or swapped. */
export function Logo({ className, height = 28 }: LogoProps) {
  return (
    <Image
      src="/brand/logo.svg"
      alt="Trilu"
      height={height}
      width={height * 4}
      className={cn(className)}
      priority
    />
  );
}
