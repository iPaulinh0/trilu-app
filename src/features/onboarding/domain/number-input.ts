/**
 * Normalizes a user-typed decimal (weight field accepts "78,5" or "78.5")
 * into a JS number. Returns null when the input isn't a parseable number so
 * callers/schemas can produce a proper validation error instead of NaN.
 */
export function parseDecimalInput(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (normalized === "") return null;
  const value = Number(normalized);
  return Number.isFinite(value) ? value : null;
}
