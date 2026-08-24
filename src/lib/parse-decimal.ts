/** Normalizes a user-typed decimal ("22,5" or "22.5") into a number, or null if unparseable. */
export function parseDecimalInput(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
