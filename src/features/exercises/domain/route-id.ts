import type { ExerciseProvider } from "./types";

const SEPARATOR = "__";

/** Encodes an exercise identity into a single URL path segment. */
export function encodeExerciseRouteId(provider: ExerciseProvider, providerId: string): string {
  return `${provider}${SEPARATOR}${providerId}`;
}

export function decodeExerciseRouteId(segment: string): { provider: ExerciseProvider; providerId: string } | null {
  const index = segment.indexOf(SEPARATOR);
  if (index === -1) return null;
  const provider = segment.slice(0, index);
  const providerId = segment.slice(index + SEPARATOR.length);
  if ((provider !== "exercisedb" && provider !== "custom") || !providerId) return null;
  return { provider, providerId };
}
