import Image from "next/image";
import { cn } from "@/lib/utils";

interface MascotProps {
  size?: number;
  className?: string;
  priority?: boolean;
}

/** Tilu, the brand mascot. The only illustration this app uses — never an emoji or icon. */
export function Mascot({ size = 200, className, priority = false }: MascotProps) {
  return (
    <Image
      src="/brand/mascot-tilu.png"
      alt="Tilu, o mascote da Trilu"
      width={size}
      height={size}
      priority={priority}
      className={cn("object-contain", className)}
    />
  );
}
