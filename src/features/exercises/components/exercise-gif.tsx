"use client";

import { useEffect, useRef, useState } from "react";
import { Mascot } from "@/components/shared/mascot";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ExerciseGifProps {
  gifUrl: string | null;
  alt: string;
  className?: string;
}

/**
 * Only starts loading the GIF once it's near the viewport — a results list
 * never plays every animation at once. Custom exercises (no gifUrl) show
 * the mascot placeholder, never a fabricated image.
 */
export function ExerciseGif({ gifUrl, alt, className }: ExerciseGifProps) {
  const [isNearViewport, setIsNearViewport] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gifUrl || isNearViewport) return;
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [gifUrl, isNearViewport]);

  if (!gifUrl) {
    return (
      <div
        ref={ref}
        role="img"
        aria-label={`${alt}, sem demonstração em GIF`}
        className={cn("flex items-center justify-center bg-violet-50", className)}
      >
        <Mascot size={40} />
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden bg-ink-50", className)}>
      {isNearViewport ? (
        // eslint-disable-next-line @next/next/no-img-element -- animated GIFs from an external, ever-changing URL; next/image would re-encode/cache them, which we must not do.
        <img src={gifUrl} alt={alt} loading="lazy" className="size-full object-cover" />
      ) : (
        <Skeleton className="size-full rounded-none" />
      )}
    </div>
  );
}
