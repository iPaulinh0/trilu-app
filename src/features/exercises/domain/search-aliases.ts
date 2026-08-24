/**
 * Basic PT-BR → EN search aliases for the free ExerciseDB tier, whose
 * catalog is English-only. Deliberately a short, controlled list — not a
 * general translator.
 */
const SEARCH_ALIASES: { pt: string; en: string }[] = [
  { pt: "supino", en: "bench press" },
  { pt: "agachamento", en: "squat" },
  { pt: "rosca", en: "curl" },
  { pt: "remada", en: "row" },
  { pt: "puxada", en: "pulldown" },
  { pt: "elevação lateral", en: "lateral raise" },
  { pt: "elevacao lateral", en: "lateral raise" },
  { pt: "desenvolvimento", en: "shoulder press" },
  { pt: "levantamento terra", en: "deadlift" },
];

/**
 * If the query contains a known PT-BR alias, swaps it for the English term
 * the provider actually indexes on. Falls back to the original query
 * untouched when nothing matches.
 */
export function resolveSearchTerm(rawQuery: string): string {
  const normalized = rawQuery.trim().toLowerCase();
  for (const { pt, en } of SEARCH_ALIASES) {
    if (normalized.includes(pt)) {
      return normalized.replace(pt, en);
    }
  }
  return rawQuery;
}
