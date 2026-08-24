export type ExerciseCatalogErrorReason = "timeout" | "rateLimited" | "unavailable" | "notFound";

export class ExerciseCatalogError extends Error {
  reason: ExerciseCatalogErrorReason;
  constructor(reason: ExerciseCatalogErrorReason, message: string) {
    super(message);
    this.name = "ExerciseCatalogError";
    this.reason = reason;
  }
}
