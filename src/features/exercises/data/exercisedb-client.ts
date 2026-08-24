/**
 * Server-only client for the free ExerciseDB tier (oss.exercisedb.dev).
 * Confirmed live against the real API — see docs at
 * https://oss.exercisedb.dev/docs. Never imported by a component; only by
 * the Route Handlers under src/app/api/exercises.
 */

const BASE_URL = "https://oss.exercisedb.dev";
const REQUEST_TIMEOUT_MS = 8000;

export class ExerciseDbTimeoutError extends Error {
  constructor() {
    super("A ExerciseDB demorou para responder.");
    this.name = "ExerciseDbTimeoutError";
  }
}

export class ExerciseDbRateLimitError extends Error {
  constructor() {
    super("Muitas buscas em pouco tempo. Aguarde um instante.");
    this.name = "ExerciseDbRateLimitError";
  }
}

export class ExerciseDbUnavailableError extends Error {
  status?: number;
  constructor(message = "A ExerciseDB está indisponível no momento.", status?: number) {
    super(message);
    this.name = "ExerciseDbUnavailableError";
    this.status = status;
  }
}

/** Raw shape actually returned by GET /api/v1/exercises and /exercises/{id}. */
export interface RawExerciseDbItem {
  exerciseId: string;
  name: string;
  gifUrl?: string;
  bodyParts: string[];
  equipments: string[];
  targetMuscles: string[];
  secondaryMuscles: string[];
  instructions?: string[];
}

export interface RawExerciseDbListMeta {
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextCursor?: string;
  previousCursor?: string;
}

export interface RawExerciseDbListResponse {
  success: boolean;
  meta: RawExerciseDbListMeta;
  data: RawExerciseDbItem[];
}

export interface RawExerciseDbItemResponse {
  success: boolean;
  data: RawExerciseDbItem;
}

async function requestJson(path: string, params: Record<string, string | undefined>): Promise<unknown> {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      // No caching by default — media/data URLs can change; see feature
      // README-level rule: never persist ExerciseDB responses.
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") throw new ExerciseDbTimeoutError();
    throw new ExerciseDbUnavailableError();
  } finally {
    clearTimeout(timeout);
  }

  if (response.status === 429) throw new ExerciseDbRateLimitError();
  if (!response.ok) throw new ExerciseDbUnavailableError(`ExerciseDB respondeu ${response.status}.`, response.status);

  try {
    return await response.json();
  } catch {
    throw new ExerciseDbUnavailableError("Resposta inválida da ExerciseDB.");
  }
}

export interface ListExercisesParams {
  name?: string;
  targetMuscles?: string[];
  secondaryMuscles?: string[];
  bodyParts?: string[];
  equipments?: string[];
  limit?: number;
  after?: string;
  before?: string;
}

export async function fetchExerciseDbList(params: ListExercisesParams): Promise<RawExerciseDbListResponse> {
  const json = await requestJson("/api/v1/exercises", {
    name: params.name,
    targetMuscles: params.targetMuscles?.join(","),
    secondaryMuscles: params.secondaryMuscles?.join(","),
    bodyParts: params.bodyParts?.join(","),
    equipments: params.equipments?.join(","),
    limit: params.limit ? String(params.limit) : undefined,
    after: params.after,
    before: params.before,
  });
  return json as RawExerciseDbListResponse;
}

export async function fetchExerciseDbById(exerciseId: string): Promise<RawExerciseDbItem | null> {
  try {
    const json = (await requestJson(`/api/v1/exercises/${encodeURIComponent(exerciseId)}`, {})) as RawExerciseDbItemResponse;
    return json.data;
  } catch (error) {
    if (error instanceof ExerciseDbUnavailableError && error.status === 404) return null;
    throw error;
  }
}
