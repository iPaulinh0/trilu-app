/** "45 min" / "menos de 1 min" — shared across the session summary and share card. */
export function formatWorkoutDuration(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  if (minutes < 1) return "menos de 1 min";
  return `${minutes} min`;
}
