/**
 * Id generator for locally-created records. Lives in `lib` (not `domain`)
 * because it touches the platform's crypto global — repositories (the data
 * layer) may import this; pure domain modules must not.
 */
export function createId(prefix: string): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36);
  return `${prefix}_${random}`;
}
